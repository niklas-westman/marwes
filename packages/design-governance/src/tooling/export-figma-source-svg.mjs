#!/usr/bin/env node
import { createHash, randomUUID } from "node:crypto"
import { mkdir, realpath, writeFile } from "node:fs/promises"
import { isAbsolute, join, relative, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { BridgeServer } from "./figma-bridge-server.mjs"

const nodePattern = /^(?:I)?\d+:\d+(?:;\d+:\d+)*$/
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex")
const repoRoot = fileURLToPath(new URL("../../../../", import.meta.url))

export function parseSourceSvgArgs(args) {
  /** @type {{nodeIds: string[], expectedFileKey: string, expectedFileName: string, verifiedFileUrl: string|null, port: number|undefined, timeoutMs: number, help?: boolean}} */
  const options = {
    nodeIds: [],
    expectedFileKey: "",
    expectedFileName: "",
    verifiedFileUrl: null,
    port: undefined,
    timeoutMs: 30000,
  }
  for (let i = 0; i < args.length; i++) {
    const flag = args[i]
    if (flag === "--") continue
    if (flag === "--help") return { ...options, help: true }
    const value = args[++i]
    if (!value || value.startsWith("--")) throw Error(`Missing value for ${flag}`)
    if (flag === "--node") options.nodeIds.push(value)
    else if (flag === "--file-key") options.expectedFileKey = value
    else if (flag === "--file-name") options.expectedFileName = value
    else if (flag === "--verified-file-url") options.verifiedFileUrl = value
    else if (flag === "--port") options.port = Number(value)
    else if (flag === "--timeout") options.timeoutMs = Number(value)
    else throw Error(`Unknown option ${flag}`)
  }
  if (!/^[a-zA-Z0-9]+$/.test(options.expectedFileKey) || !options.expectedFileName.trim())
    throw Error("Explicit --file-key and --file-name are required")
  if (
    !options.nodeIds.length ||
    options.nodeIds.length > 16 ||
    options.nodeIds.some((id) => !nodePattern.test(id)) ||
    new Set(options.nodeIds).size !== options.nodeIds.length
  )
    throw Error("Provide 1–16 unique explicit Figma node IDs")
  if (
    options.port !== undefined &&
    (!Number.isInteger(options.port) || options.port < 9223 || options.port > 9232)
  )
    throw Error("Bridge port must be 9223–9232; occupied ports are never replaced")
  if (!Number.isInteger(options.timeoutMs) || options.timeoutMs < 1 || options.timeoutMs > 120000)
    throw Error("Timeout must be 1–120000ms")
  if (options.verifiedFileUrl) {
    const url = new URL(options.verifiedFileUrl)
    if (
      url.protocol !== "https:" ||
      !["figma.com", "www.figma.com"].includes(url.hostname) ||
      url.username ||
      url.password ||
      url.pathname.split("/")[1] !== "design" ||
      url.pathname.split("/")[2] !== options.expectedFileKey
    )
      throw Error("Verified file URL must identify the exact expected Figma design file")
  }
  return options
}

export function selectSourceClient(server, options) {
  const candidates = [...server.clients].filter((client) => {
    const info = client.fileInfo
    return (
      info?.fileName === options.expectedFileName &&
      (info.fileKey === options.expectedFileKey || (!info.fileKey && options.verifiedFileUrl))
    )
  })
  if (candidates.length > 1)
    throw Error("Ambiguous Figma clients; close the unrelated duplicate before export")
  return candidates[0]
}

/** Allow the plugin's two-second port scan to announce existing clients. */
export async function waitForSourceClient(server, options) {
  return await new Promise((resolveClient, rejectClient) => {
    let quietTimer
    const cleanup = () => {
      clearTimeout(quietTimer)
      clearTimeout(deadline)
      server.off("client:update", onUpdate)
    }
    const fail = (error) => {
      cleanup()
      rejectClient(error)
    }
    const onUpdate = () => {
      clearTimeout(quietTimer)
      try {
        if (!selectSourceClient(server, options)) return
        quietTimer = setTimeout(() => {
          try {
            const client = selectSourceClient(server, options)
            if (!client) return
            cleanup()
            resolveClient(client)
          } catch (error) {
            fail(error)
          }
        }, 2500)
      } catch (error) {
        fail(error)
      }
    }
    const deadline = setTimeout(
      () => fail(Error("Timed out waiting for an unambiguous stable Figma file connection")),
      options.timeoutMs,
    )
    server.on("client:update", onUpdate)
    onUpdate()
  })
}

export async function captureSourceSvg(options, root = repoRoot) {
  if (process.env.CI) throw Error("Live Figma source capture is disabled in CI")
  const server = new BridgeServer({ host: "localhost", port: options.port })
  try {
    await server.start()
    const client = await waitForSourceClient(server, options)
    if (selectSourceClient(server, options) !== client)
      throw Error("Selected Figma connection changed before export")
    const result = await server.sendCommand(
      client,
      "EXPORT_SOURCE_SVG",
      {
        nodeIds: options.nodeIds,
        expectedFileKey: options.expectedFileKey,
        expectedFileName: options.expectedFileName,
        verifiedFileIdentity: Boolean(options.verifiedFileUrl),
      },
      options.timeoutMs,
    )
    if (selectSourceClient(server, options) !== client)
      throw Error("Figma connection became ambiguous or changed during export")
    return await saveSourceSvgCapture(root, options, result, {
      bridgePort: server.port,
      observedFileInfo: client.fileInfo,
    })
  } finally {
    await server.close()
  }
}

export async function saveSourceSvgCapture(root, options, response, connection) {
  if (!response || !Array.isArray(response.nodes) || !Array.isArray(response.errors))
    throw Error("Malformed SVG export response")
  const result = {
    success: response.success,
    errors: response.errors,
    exportSettings: response.exportSettings,
    exportedAt: response.exportedAt,
    fileIdentity: {
      expectedFileKey: response.requestedFile?.fileKey,
      expectedFileName: response.requestedFile?.fileName,
      reportedFileKey: response.reportedFile?.fileKey,
      reportedFileName: response.reportedFile?.fileName,
      verification: response.identityVerification,
    },
    exported: response.nodes.map((entry) => ({
      nodeId: entry.requestedNodeId,
      metadata: entry.metadata,
      svg: entry.svg,
      byteLength: entry.byteLength,
    })),
  }
  // The plugin validates identity again at export time; never infer an actual key
  // from a caller's expectation or silently turn live observations into pinned truth.
  if (
    !result ||
    typeof result !== "object" ||
    !Array.isArray(result.exported) ||
    !Array.isArray(result.errors)
  )
    throw Error("Malformed SVG export response")
  const identity = result.fileIdentity
  if (
    !identity ||
    identity.expectedFileKey !== options.expectedFileKey ||
    identity.expectedFileName !== options.expectedFileName ||
    identity.reportedFileName !== options.expectedFileName ||
    (identity.reportedFileKey
      ? identity.reportedFileKey !== options.expectedFileKey ||
        identity.verification !== "reported-key"
      : !options.verifiedFileUrl || identity.verification !== "caller-verified-file-name")
  )
    throw Error("SVG export file identity differs from the exact selected file")
  if (
    result.exportSettings?.format !== "SVG" ||
    result.exportSettings.svgOutlineText !== true ||
    result.exportSettings.svgSimplifyStroke !== false ||
    result.exportSettings.svgIdAttribute !== true
  )
    throw Error("Exporter did not use required outlined SVG settings")
  const requested = new Set(options.nodeIds)
  const seen = new Set()
  let totalBytes = 0
  for (const entry of [...result.exported, ...result.errors]) {
    if (!entry || !requested.has(entry.nodeId) || seen.has(entry.nodeId))
      throw Error("Unknown or duplicate returned source node")
    seen.add(entry.nodeId)
  }
  if (seen.size !== requested.size || result.success !== (result.errors.length === 0))
    throw Error("SVG export omitted a requested node or contradicted its outcome")
  for (const entry of result.exported) {
    if (typeof entry.svg !== "string" || !/^\s*(?:<\?xml[^>]*>\s*)?<svg[\s>]/.test(entry.svg))
      throw Error("Export is not an SVG document")
    if (/<text[\s>]/i.test(entry.svg)) throw Error("Export contains unoutlined text")
    if (entry.metadata?.nodeId !== entry.nodeId)
      throw Error("Export metadata node identity mismatch")
    const size = Buffer.byteLength(entry.svg, "utf8")
    if (entry.byteLength !== size) throw Error("Export byte length mismatch")
    totalBytes += size
    if (size > 2 * 1024 * 1024 || totalBytes > 8 * 1024 * 1024)
      throw Error("SVG export exceeds capture limits")
  }
  const parent = join(root, ".reflection", "figma-source-svg")
  await mkdir(parent, { recursive: true })
  const resolvedParent = await realpath(parent)
  const inside = relative(await realpath(root), resolvedParent)
  if (inside.startsWith("..") || isAbsolute(inside))
    throw Error("Capture directory escapes the repository")
  const directory = join(resolvedParent, `${Date.now()}-${randomUUID()}`)
  await mkdir(directory)
  const artifacts = []
  for (const [index, entry] of result.exported.entries()) {
    const path = `${String(index).padStart(3, "0")}-source.svg`
    const bytes = Buffer.from(entry.svg, "utf8")
    await writeFile(join(directory, path), bytes, { flag: "wx" })
    const { svg, ...provenance } = entry
    artifacts.push({
      ...provenance,
      path,
      mimeType: "image/svg+xml",
      bytes: bytes.length,
      sha256: sha256(bytes),
    })
  }
  const manifest = {
    schema: "marwes.figma-outlined-source/v1",
    sourceScope: "live-diagnostic-observation",
    capturedAt: new Date().toISOString(),
    exportedAt: result.exportedAt,
    success: result.success,
    fileIdentity: identity,
    callerVerifiedFileUrl: options.verifiedFileUrl,
    connection,
    nodeIds: options.nodeIds,
    exportSettings: result.exportSettings,
    artifacts,
    errors: result.errors,
    approval: "none",
    referencePromotion: "none",
  }
  await writeFile(join(directory, "capture.json"), `${JSON.stringify(manifest, null, 2)}\n`, {
    flag: "wx",
  })
  return { directory, ...manifest }
}

export async function main(args) {
  const options = parseSourceSvgArgs(args)
  if (options.help) {
    console.log(
      "Read-only outlined SVG capture.\n--file-key <key> --file-name <exact name> --node <id> [--node <id> ...]\n[--verified-file-url <independently observed URL>] [--port <9223-9232>] [--timeout <ms>]\nOutputs a fresh .reflection/figma-source-svg capture. Never promotes references.",
    )
    return
  }
  const result = await captureSourceSvg(options)
  console.log(JSON.stringify(result, null, 2))
  if (!result.success) process.exitCode = 1
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main(process.argv.slice(2)).catch((error) => {
    console.error(error.message)
    process.exitCode = 1
  })
}
