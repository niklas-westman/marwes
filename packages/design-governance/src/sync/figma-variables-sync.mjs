#!/usr/bin/env node

import { createHash } from "node:crypto"
import { EventEmitter } from "node:events"
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import http from "node:http"
import { dirname, resolve } from "node:path"

const defaultConfigPath = ".pi/figma-sync.json"
const defaultPortStart = 9223
const defaultPortEnd = 9232
const defaultHost = "localhost"
const websocketMagicGuid = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11"

function usage() {
  return [
    "Usage:",
    "  pnpm --filter @marwes-ui/design-governance variables-sync",
    "  pnpm --filter @marwes-ui/design-governance variables-sync -- --target marwes",
    "  pnpm --filter @marwes-ui/design-governance variables-sync -- --file-key vPFR4oMnI9jONyoejrKp3a",
    "",
    "Options:",
    "  --target <name>       Target from .pi/figma-sync.json. Defaults to defaultTarget.",
    "  --config <path>       Figma sync config path. Defaults to .pi/figma-sync.json.",
    "  --output <path>       Output path. Defaults to <target.liveDir>/tokens/variables.json.",
    "  --file-key <key>      Override the expected connected Figma file key.",
    "  --accept-any-file     Use the first connected Figma file even if Figma does not report the expected key.",
    "  --host <host>         WebSocket host. Defaults to localhost.",
    "  --port <port>         Use one exact bridge port instead of scanning 9223-9232.",
    "  --timeout <ms>        Wait timeout. Defaults to 120000.",
    "  --no-refresh          Use cached plugin variables instead of requesting a refresh.",
    "  --dry-run             Print summary without writing variables.json.",
    "  --json                Print machine-readable summary.",
  ].join("\n")
}

function parseArgs(argv) {
  const options = {
    configPath: defaultConfigPath,
    targetName: undefined,
    outputPath: undefined,
    fileKey: undefined,
    acceptAnyFile: false,
    host: defaultHost,
    port: undefined,
    timeoutMs: 120000,
    refresh: true,
    dryRun: false,
    json: false,
    help: false,
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]

    function readValue() {
      const value = argv[index + 1]
      if (!value || value.startsWith("--")) {
        throw new Error(`Missing value for ${arg}`)
      }
      index += 1
      return value
    }

    if (arg === "--help" || arg === "-h") options.help = true
    else if (arg === "--target") options.targetName = readValue()
    else if (arg === "--config") options.configPath = readValue()
    else if (arg === "--output") options.outputPath = readValue()
    else if (arg === "--file-key") options.fileKey = readValue()
    else if (arg === "--accept-any-file") options.acceptAnyFile = true
    else if (arg === "--host") options.host = readValue()
    else if (arg === "--port") options.port = Number(readValue())
    else if (arg === "--timeout") options.timeoutMs = Number(readValue())
    else if (arg === "--no-refresh") options.refresh = false
    else if (arg === "--dry-run") options.dryRun = true
    else if (arg === "--json") options.json = true
    else throw new Error(`Unknown argument: ${arg}`)
  }

  if (options.port !== undefined && !Number.isInteger(options.port)) {
    throw new Error("--port must be an integer")
  }

  if (!Number.isInteger(options.timeoutMs) || options.timeoutMs <= 0) {
    throw new Error("--timeout must be a positive integer")
  }

  return options
}

function log(options, message) {
  if (!options.json) console.log(message)
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"))
}

function writeJson(path, value) {
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`)
}

function extractFileKey(figmaFile) {
  if (!figmaFile) return undefined

  try {
    const url = new URL(figmaFile)
    const match = url.pathname.match(/\/(?:design|file)\/([a-zA-Z0-9]+)/)
    return match?.[1]
  } catch {
    return figmaFile
  }
}

function readSyncTarget(repoRoot, options) {
  const configPath = resolve(repoRoot, options.configPath)
  if (!existsSync(configPath)) {
    throw new Error(`Missing ${options.configPath}`)
  }

  const config = readJson(configPath)
  const targetName = options.targetName ?? config.defaultTarget
  const target = config.targets?.[targetName]
  if (!target) {
    throw new Error(`Unknown Figma sync target: ${targetName}`)
  }

  const expectedFileKey = options.fileKey ?? extractFileKey(target.figmaFile)
  if (!expectedFileKey) {
    throw new Error(`Could not resolve file key for target: ${targetName}`)
  }

  return {
    name: targetName,
    label: target.label ?? targetName,
    figmaFile: target.figmaFile,
    liveDir: target.liveDir,
    outputPath: options.outputPath ?? `${target.liveDir}/tokens/variables.json`,
    expectedFileKey,
  }
}

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
  return url.protocol === "https:" && (url.hostname === "www.figma.com" || url.hostname === "figma.com")
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

class BridgeServer extends EventEmitter {
  constructor({ host, port }) {
    super()
    this.host = host
    this.requestedPort = port
    this.port = undefined
    this.clients = new Set()
    this.pendingRequests = new Map()
    this.requestId = 0
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
        this.port = port
        return port
      } catch (error) {
        server.close()
        if (error?.code !== "EADDRINUSE" || this.requestedPort) {
          throw error
        }
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
      variablesData: undefined,
      lastError: undefined,
      fragmentedOpcode: undefined,
      fragmentedPayloads: [],
      closed: false,
    }

    this.clients.add(client)
    this.recordEvent("bridge client connected")
    this.emit("client:update")

    socket.on("data", (chunk) => {
      try {
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

      const text = frame.payload.toString("utf8")
      this.handleMessage(client, JSON.parse(text))
      return
    }

    if (frame.opcode === 0x0) {
      if (client.fragmentedOpcode === undefined) return

      client.fragmentedPayloads.push(frame.payload)
      if (!frame.fin) return

      const opcode = client.fragmentedOpcode
      const payload = Buffer.concat(client.fragmentedPayloads)
      client.fragmentedOpcode = undefined
      client.fragmentedPayloads = []

      if (opcode === 0x1) {
        const text = payload.toString("utf8")
        this.handleMessage(client, JSON.parse(text))
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
      clearTimeout(pending.timeout)
      this.pendingRequests.delete(message.id)

      if (message.error) pending.reject(new Error(message.error))
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

    if (message.type === "VARIABLES_DATA" && message.data) {
      client.variablesData = message.data
      const count = message.data.variables?.length ?? 0
      this.recordEvent(`variables data received: ${count} variables`)
      this.emit("client:update")
      return
    }

    if (message.type === "ERROR") {
      const error = message.error ?? message.data?.error ?? "unknown plugin error"
      client.lastError = error
      this.recordEvent(`plugin error: ${error}`)
      this.emit("client:update")
      return
    }

    if (message.type === "CONSOLE_CAPTURE") {
      const data = message.data ?? message
      const level = data.level ?? "log"
      const text = data.message ?? ""
      if (level === "error" || level === "warn") {
        this.recordEvent(`plugin console ${level}: ${text}`)
      }
      this.emit("client:update")
      return
    }
  }

  sendCommand(client, method, params = {}, timeoutMs = 30000) {
    return new Promise((resolveCommand, rejectCommand) => {
      const id = `marwes_figma_${++this.requestId}_${Date.now()}`
      const timeout = setTimeout(() => {
        this.pendingRequests.delete(id)
        rejectCommand(new Error(`${method} timed out after ${timeoutMs}ms`))
      }, timeoutMs)

      this.pendingRequests.set(id, {
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
        const fileKey =
          client.fileInfo?.fileKey ?? client.variablesData?.fileKey ?? "no file key reported"
        const variableCount = client.variablesData?.variables?.length
        const variables =
          typeof variableCount === "number" ? `${variableCount} variables` : "no variables yet"
        return `#${index + 1} ${fileName} (${fileKey}, ${variables})`
      })
      .join("; ")
  }

  describeEvents() {
    if (this.events.length === 0) return "none"
    return this.events.join(" | ")
  }

  findClient(fileKey, acceptAnyFile = false) {
    if (acceptAnyFile) {
      const clients = [...this.clients]
      return clients.find((client) => client.variablesData) ?? clients[0]
    }

    for (const client of this.clients) {
      const infoKey = client.fileInfo?.fileKey
      const variableKey = client.variablesData?.fileKey
      if (infoKey === fileKey || variableKey === fileKey) return client
    }
    return undefined
  }

  async waitForClient(fileKey, timeoutMs, acceptAnyFile = false) {
    const label = acceptAnyFile ? "any Figma file" : `Figma file ${fileKey}`
    return this.waitFor(() => this.findClient(fileKey, acceptAnyFile), timeoutMs, label)
  }

  async waitForVariables(fileKey, timeoutMs, acceptAnyFile = false) {
    return this.waitFor(
      () => this.findClient(fileKey, acceptAnyFile)?.variablesData,
      timeoutMs,
      "variables data",
    )
  }

  async waitFor(check, timeoutMs, label) {
    const current = check()
    if (current) return current

    return new Promise((resolveWait, rejectWait) => {
      const onUpdate = () => {
        const value = check()
        if (!value) return
        cleanup()
        resolveWait(value)
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

function normalizeModes(collection) {
  return (collection.modes ?? []).map((mode) => ({
    id: mode.modeId ?? mode.id,
    modeId: mode.modeId ?? mode.id,
    name: mode.name,
  }))
}

function rgbaToHex(value) {
  if (
    !value ||
    typeof value.r !== "number" ||
    typeof value.g !== "number" ||
    typeof value.b !== "number"
  ) {
    return value
  }

  const red = Math.round(value.r * 255)
    .toString(16)
    .padStart(2, "0")
  const green = Math.round(value.g * 255)
    .toString(16)
    .padStart(2, "0")
  const blue = Math.round(value.b * 255)
    .toString(16)
    .padStart(2, "0")
  const alpha =
    typeof value.a === "number" && value.a < 1
      ? Math.round(value.a * 255)
          .toString(16)
          .padStart(2, "0")
      : ""

  return `#${red}${green}${blue}${alpha}`.toLowerCase()
}

function normalizeValue(value, variableById) {
  if (value?.type === "VARIABLE_ALIAS") {
    return {
      type: "VARIABLE_ALIAS",
      id: value.id,
      name: variableById.get(value.id)?.name ?? null,
    }
  }

  return rgbaToHex(value)
}

function buildArtifact({ target, variablesData }) {
  const collections = variablesData.variableCollections ?? variablesData.collections ?? []
  const variables = variablesData.variables ?? []
  const collectionById = new Map(collections.map((collection) => [collection.id, collection]))
  const variableById = new Map(variables.map((variable) => [variable.id, variable]))

  return {
    schemaVersion: 1,
    source: "marwes/@marwes-ui/design-governance/figma-variables-sync",
    bridge: "marwes-variables-bridge",
    target: target.name,
    figmaFile: target.figmaFile,
    fileKey: variablesData.fileKey ?? target.expectedFileKey,
    syncedAt: new Date().toISOString(),
    diagnostics: {
      localVariableCount: variablesData.localVariableCount ?? null,
      boundVariableIds: variablesData.boundVariableIds ?? [],
      unresolvedBoundVariableIds: variablesData.unresolvedBoundVariableIds ?? [],
      resolutionErrors: variablesData.resolutionErrors ?? [],
    },
    collections: collections.map((collection) => ({
      id: collection.id,
      key: collection.key,
      name: collection.name,
      defaultModeId: collection.defaultModeId,
      modes: normalizeModes(collection),
      variableIds: collection.variableIds ?? [],
    })),
    variables: variables.map((variable) => {
      const collection = collectionById.get(variable.variableCollectionId)
      const modes = new Map(
        normalizeModes(collection ?? {}).map((mode) => [mode.modeId, mode.name]),
      )
      const valuesByModeId = {}
      const valuesByMode = {}

      for (const [modeId, value] of Object.entries(variable.valuesByMode ?? {})) {
        const normalizedValue = normalizeValue(value, variableById)
        const modeName = modes.get(modeId) ?? modeId
        valuesByModeId[modeId] = normalizedValue
        valuesByMode[modeName] = normalizedValue
      }

      return {
        id: variable.id,
        key: variable.key,
        name: variable.name,
        path: variable.name,
        tokenName: variable.name,
        collectionId: variable.variableCollectionId,
        variableCollectionId: variable.variableCollectionId,
        collectionName: collection?.name ?? null,
        resolvedType: variable.resolvedType,
        scopes: variable.scopes ?? [],
        description: variable.description ?? "",
        hiddenFromPublishing: Boolean(variable.hiddenFromPublishing),
        valuesByMode,
        valuesByModeId,
        rawValuesByMode: variable.valuesByMode ?? {},
      }
    }),
  }
}

function buildSummary({ server, target, artifact, outputPath, dryRun }) {
  return {
    success: true,
    target: target.name,
    fileKey: artifact.fileKey,
    port: server.port,
    outputPath,
    dryRun,
    collections: artifact.collections.length,
    variables: artifact.variables.length,
    variablesByType: artifact.variables.reduce((counts, variable) => {
      counts[variable.resolvedType] = (counts[variable.resolvedType] ?? 0) + 1
      return counts
    }, {}),
  }
}

async function main(argv) {
  const options = parseArgs(argv)
  if (options.help) {
    console.log(usage())
    return
  }

  const repoRoot = process.cwd()
  const target = readSyncTarget(repoRoot, options)
  const outputPath = resolve(repoRoot, target.outputPath)
  const server = new BridgeServer({
    host: options.host,
    port: options.port,
  })

  try {
    const port = await server.start()
    log(options, `Figma variables sync waiting on ws://${options.host}:${port}`)
    log(options, "Open Figma Desktop, then run Plugins > Development > Marwes Figma Bridge.")
    log(options, `Expected file key: ${target.expectedFileKey}`)
    if (options.acceptAnyFile) {
      log(options, "File-key guard: accepting the first connected Figma file.")
    }

    let client
    try {
      client = await server.waitForClient(
        target.expectedFileKey,
        options.timeoutMs,
        options.acceptAnyFile,
      )
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      throw new Error(
        `${message}. Observed bridge clients: ${server.describeClients()}. Recent bridge events: ${server.describeEvents()}`,
      )
    }

    const connectedFileName = client.fileInfo?.fileName ?? "Figma file"
    const connectedFileKey =
      client.fileInfo?.fileKey ?? client.variablesData?.fileKey ?? "no file key reported"
    log(options, `Connected to ${connectedFileName} (${connectedFileKey})`)

    let variablesData
    if (options.refresh) {
      try {
        const refreshResult = await server.sendCommand(
          client,
          "REFRESH_VARIABLES",
          {},
          options.timeoutMs,
        )
        variablesData = refreshResult?.data
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        log(options, `Refresh did not finish: ${message}`)
        log(options, "Falling back to the variables payload cached by the Figma bridge.")
      }
    } else {
      try {
        const cachedResult = await server.sendCommand(
          client,
          "GET_VARIABLES_DATA",
          {},
          Math.min(options.timeoutMs, 10000),
        )
        variablesData = cachedResult?.data ?? cachedResult
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        log(options, `Cached variable request did not finish: ${message}`)
        log(options, "Waiting for the bridge to broadcast variables data.")
      }
    }

    if (!variablesData) {
      try {
        variablesData = await server.waitForVariables(
          target.expectedFileKey,
          options.timeoutMs,
          options.acceptAnyFile,
        )
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        throw new Error(
          `${message}. Observed bridge clients: ${server.describeClients()}. Recent bridge events: ${server.describeEvents()}`,
        )
      }
    }

    const artifact = buildArtifact({ target, variablesData })

    if (!options.dryRun) {
      writeJson(outputPath, artifact)
    }

    const summary = buildSummary({
      server,
      target,
      artifact,
      outputPath: target.outputPath,
      dryRun: options.dryRun,
    })

    if (options.json) console.log(JSON.stringify(summary, null, 2))
    else {
      log(options, "")
      log(options, `Wrote ${summary.variables} variables from ${summary.collections} collections.`)
      log(options, `Output: ${target.outputPath}`)
    }
  } finally {
    await server.close()
  }
}

const cliArgs = process.argv.slice(2).filter((arg) => arg !== "--")

main(cliArgs).catch((error) => {
  const message = error instanceof Error ? error.message : String(error)
  if (cliArgs.includes("--json")) {
    console.log(JSON.stringify({ success: false, error: message }, null, 2))
  } else {
    console.error(message)
  }
  process.exit(1)
})
