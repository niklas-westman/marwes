import { createHash, randomUUID } from "node:crypto"
import { EventEmitter } from "node:events"
import http from "node:http"

const defaultPortStart = 9223
const defaultPortEnd = 9232
const maxMessageBytes = 16 * 1024 * 1024
const websocketMagicGuid = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11"

function isAllowedOrigin(origin) {
  if (!origin || origin === "null") return true
  let url
  try {
    url = new URL(origin)
  } catch {
    return false
  }
  if (url.protocol === "http:" && (url.hostname === "localhost" || url.hostname === "127.0.0.1")) {
    return true
  }
  return (
    url.protocol === "https:" && (url.hostname === "www.figma.com" || url.hostname === "figma.com")
  )
}

function createAcceptKey(key) {
  return createHash("sha1").update(`${key}${websocketMagicGuid}`).digest("base64")
}

function encodeTextFrame(text) {
  const payload = Buffer.from(text, "utf8")
  const length = payload.length

  if (length < 126) {
    return Buffer.concat([Buffer.from([0x81, length]), payload])
  }

  if (length <= 0xffff) {
    const header = Buffer.alloc(4)
    header[0] = 0x81
    header[1] = 126
    header.writeUInt16BE(length, 2)
    return Buffer.concat([header, payload])
  }

  const header = Buffer.alloc(10)
  header[0] = 0x81
  header[1] = 127
  header.writeBigUInt64BE(BigInt(length), 2)
  return Buffer.concat([header, payload])
}

function encodeControlFrame(opcode, payload = Buffer.alloc(0)) {
  return Buffer.concat([Buffer.from([0x80 | opcode, payload.length]), payload])
}

function decodeFrames(client) {
  const frames = []
  let offset = 0

  while (client.buffer.length - offset >= 2) {
    const byte1 = client.buffer[offset]
    const byte2 = client.buffer[offset + 1]
    const fin = (byte1 & 0x80) !== 0
    const opcode = byte1 & 0x0f
    const masked = (byte2 & 0x80) !== 0
    let payloadLength = byte2 & 0x7f
    let headerLength = 2

    if (payloadLength === 126) {
      if (client.buffer.length - offset < 4) break
      payloadLength = client.buffer.readUInt16BE(offset + 2)
      headerLength = 4
    } else if (payloadLength === 127) {
      if (client.buffer.length - offset < 10) break
      const bigLength = client.buffer.readBigUInt64BE(offset + 2)
      if (bigLength > BigInt(Number.MAX_SAFE_INTEGER)) {
        throw new Error("WebSocket frame is too large")
      }
      payloadLength = Number(bigLength)
      headerLength = 10
    }

    if (payloadLength > maxMessageBytes) throw new Error("Bridge message exceeds 16MiB limit")

    const maskLength = masked ? 4 : 0
    const frameLength = headerLength + maskLength + payloadLength
    if (client.buffer.length - offset < frameLength) break

    const maskStart = offset + headerLength
    const payloadStart = maskStart + maskLength
    const payload = Buffer.from(client.buffer.subarray(payloadStart, payloadStart + payloadLength))

    if (masked) {
      const mask = client.buffer.subarray(maskStart, maskStart + 4)
      for (let index = 0; index < payload.length; index += 1) {
        payload[index] ^= mask[index % 4]
      }
    }

    frames.push({ fin, opcode, payload })
    offset += frameLength
  }

  client.buffer = client.buffer.subarray(offset)
  return frames
}

export class BridgeServer extends EventEmitter {
  constructor({ host, port }) {
    super()
    this.host = host
    this.requestedPort = port
    this.port = undefined
    this.clients = new Set()
    this.pendingRequests = new Map()
    this.requestId = 0
    this.requestPrefix = randomUUID()
    this.server = undefined
    this.events = []
  }

  recordEvent(message) {
    const timestamp = new Date().toISOString()
    this.events.push(`${timestamp} ${message}`)
    if (this.events.length > 20) this.events.shift()
  }

  async start() {
    const start = this.requestedPort ?? defaultPortStart
    const end = this.requestedPort ?? defaultPortEnd

    for (let port = start; port <= end; port += 1) {
      const server = http.createServer()
      server.on("upgrade", (request, socket) => this.handleUpgrade(request, socket))

      try {
        await listen(server, port, this.host)
        this.server = server
        this.port = server.address().port
        return this.port
      } catch (error) {
        server.close()
        if (error?.code !== "EADDRINUSE" || this.requestedPort) throw error
      }
    }

    throw new Error(`No available bridge port in ${start}-${end}`)
  }

  async close() {
    for (const pending of this.pendingRequests.values()) {
      clearTimeout(pending.timeout)
      pending.reject(new Error("Bridge server closed"))
    }
    this.pendingRequests.clear()

    for (const client of this.clients) {
      this.closeClient(client)
    }

    await new Promise((resolveClose) => {
      if (!this.server) {
        resolveClose()
        return
      }
      this.server.close(() => resolveClose())
    })
  }

  handleUpgrade(request, socket) {
    const key = request.headers["sec-websocket-key"]
    const origin = request.headers.origin

    if (!key || !isAllowedOrigin(origin)) {
      socket.write("HTTP/1.1 403 Forbidden\r\n\r\n")
      socket.destroy()
      return
    }

    socket.write(
      [
        "HTTP/1.1 101 Switching Protocols",
        "Upgrade: websocket",
        "Connection: Upgrade",
        `Sec-WebSocket-Accept: ${createAcceptKey(key)}`,
        "\r\n",
      ].join("\r\n"),
    )

    const client = {
      socket,
      buffer: Buffer.alloc(0),
      fileInfo: undefined,
      fragmentedOpcode: undefined,
      fragmentedPayloads: [],
      closed: false,
    }

    this.clients.add(client)
    this.recordEvent("bridge client connected")
    this.emit("client:update")

    socket.on("data", (chunk) => {
      try {
        if (client.buffer.length + chunk.length > maxMessageBytes + 14)
          throw new Error("Bridge buffer exceeds 16MiB limit")
        client.buffer = Buffer.concat([client.buffer, chunk])
        for (const frame of decodeFrames(client)) {
          this.handleFrame(client, frame)
        }
      } catch (error) {
        this.recordEvent(`bridge frame error: ${error.message}`)
        this.emit("client:error", error)
        this.closeClient(client)
      }
    })

    socket.on("close", () => {
      client.closed = true
      this.clients.delete(client)
      this.recordEvent("bridge client disconnected")
      this.emit("client:update")
    })

    socket.on("error", (error) => {
      this.recordEvent(`bridge socket error: ${error.message}`)
      this.emit("client:error", error)
      this.closeClient(client)
    })
  }

  handleFrame(client, frame) {
    if (frame.opcode === 0x1) {
      if (!frame.fin) {
        client.fragmentedOpcode = frame.opcode
        client.fragmentedPayloads = [frame.payload]
        return
      }

      this.handleMessage(client, JSON.parse(frame.payload.toString("utf8")))
      return
    }

    if (frame.opcode === 0x0) {
      if (client.fragmentedOpcode === undefined) return

      if (
        client.fragmentedPayloads.reduce((total, part) => total + part.length, 0) +
          frame.payload.length >
        maxMessageBytes
      )
        throw new Error("Fragmented bridge message exceeds 16MiB limit")
      client.fragmentedPayloads.push(frame.payload)
      if (!frame.fin) return

      const opcode = client.fragmentedOpcode
      const payload = Buffer.concat(client.fragmentedPayloads)
      client.fragmentedOpcode = undefined
      client.fragmentedPayloads = []

      if (opcode === 0x1) {
        this.handleMessage(client, JSON.parse(payload.toString("utf8")))
      }
      return
    }

    if (frame.opcode === 0x8) {
      this.closeClient(client)
      return
    }

    if (frame.opcode === 0x9) {
      client.socket.write(encodeControlFrame(0x0a, frame.payload))
    }
  }

  handleMessage(client, message) {
    if (message.id && this.pendingRequests.has(message.id)) {
      const pending = this.pendingRequests.get(message.id)
      if (pending.client !== client) return
      clearTimeout(pending.timeout)
      this.pendingRequests.delete(message.id)

      if (message.error && !message.result) pending.reject(new Error(message.error))
      else pending.resolve(message.result)
      return
    }

    if (message.type === "FILE_INFO" && message.data) {
      client.fileInfo = message.data
      const fileName = message.data.fileName ?? "unknown file"
      const fileKey = message.data.fileKey ?? "no file key reported"
      this.recordEvent(`file info: ${fileName} (${fileKey})`)
      this.emit("client:update")
      return
    }

    if (message.type === "ERROR") {
      const error = message.error ?? message.data?.error ?? "unknown plugin error"
      this.recordEvent(`plugin error: ${error}`)
      this.emit("client:update")
      return
    }
  }

  sendCommand(client, method, params = {}, timeoutMs = 30000) {
    return new Promise((resolveCommand, rejectCommand) => {
      const id = `marwes_figma_${this.requestPrefix}_${++this.requestId}`
      const timeout = setTimeout(() => {
        this.pendingRequests.delete(id)
        rejectCommand(new Error(`${method} timed out after ${timeoutMs}ms`))
      }, timeoutMs)

      this.pendingRequests.set(id, {
        client,
        resolve: resolveCommand,
        reject: rejectCommand,
        timeout,
      })

      this.sendJson(client, { id, method, params })
    })
  }

  sendJson(client, message) {
    client.socket.write(encodeTextFrame(JSON.stringify(message)))
  }

  closeClient(client) {
    if (client.closed) return
    client.closed = true
    try {
      client.socket.write(encodeControlFrame(0x8))
      client.socket.end()
    } catch {
      client.socket.destroy()
    }
    this.clients.delete(client)
    this.recordEvent("bridge client closed")
    this.emit("client:update")
  }

  describeClients() {
    if (this.clients.size === 0) return "none"

    return [...this.clients]
      .map((client, index) => {
        const fileName = client.fileInfo?.fileName ?? "unknown file"
        const fileKey = client.fileInfo?.fileKey ?? "no file key reported"
        return `#${index + 1} ${fileName} (${fileKey})`
      })
      .join("; ")
  }

  describeEvents() {
    if (this.events.length === 0) return "none"
    return this.events.join(" | ")
  }

  findClient(fileKey, acceptAnyFile = false) {
    if (acceptAnyFile) return [...this.clients][0]

    for (const client of this.clients) {
      if (client.fileInfo?.fileKey === fileKey) return client
    }
    return undefined
  }

  async waitForClient(fileKey, timeoutMs, acceptAnyFile = false) {
    const label = acceptAnyFile ? "any Figma file" : `Figma file ${fileKey}`
    return this.waitFor(() => this.findClient(fileKey, acceptAnyFile), timeoutMs, label)
  }

  async waitFor(check, timeoutMs, label) {
    const current = check()
    if (current) return current

    return new Promise((resolveWait, rejectWait) => {
      const onUpdate = () => {
        try {
          const value = check()
          if (!value) return
          cleanup()
          resolveWait(value)
        } catch (error) {
          cleanup()
          rejectWait(error)
        }
      }

      const cleanup = () => {
        clearTimeout(timeout)
        this.off("client:update", onUpdate)
      }

      const timeout = setTimeout(() => {
        cleanup()
        rejectWait(new Error(`Timed out waiting for ${label}`))
      }, timeoutMs)

      this.on("client:update", onUpdate)
    })
  }
}

function listen(server, port, host) {
  return new Promise((resolveListen, rejectListen) => {
    const onError = (error) => {
      server.off("listening", onListening)
      rejectListen(error)
    }

    const onListening = () => {
      server.off("error", onError)
      resolveListen()
    }

    server.once("error", onError)
    server.once("listening", onListening)
    server.listen(port, host)
  })
}
