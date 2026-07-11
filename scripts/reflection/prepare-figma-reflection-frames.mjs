#!/usr/bin/env node

import { createHash } from "node:crypto"
import { EventEmitter } from "node:events"
import { existsSync, readFileSync, readdirSync } from "node:fs"
import { mkdir, writeFile } from "node:fs/promises"
import http from "node:http"
import { dirname, join, relative, resolve, sep } from "node:path"
import { fileURLToPath } from "node:url"
import {
  findContractCase,
  loadDesignSource,
  loadReflectionContract,
  writeBaselineReceipt,
} from "../../packages/design-governance/src/baseline-receipts.mjs"
import { writeGeneratedFrameProvenance } from "../../packages/design-governance/src/generated-frame-provenance.mjs"

const repoRoot = fileURLToPath(new URL("../../", import.meta.url))
const defaultFamiliesRoot = "packages/design-governance/reflection-families"
const defaultSourceRegistry =
  "packages/design-governance/reflection-families/source-frame-registry.json"
const defaultHost = "localhost"
const defaultPortStart = 9243
const defaultPortEnd = 9252
const websocketMagicGuid = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11"
const supportedStrategies = new Set(["rowChild", "rowContent", "directNode"])
const supportedDestinations = new Set(["source-page", "current", "named"])
const defaultModes = ["light", "dark"]

function usage() {
  return [
    "Usage:",
    "  pnpm reflection:figma:prepare-frames -- --all --dry-run",
    "  pnpm reflection:figma:prepare-frames -- --family card --dry-run",
    "  pnpm reflection:figma:prepare-frames -- --all --connect --dry-run",
    "  pnpm reflection:figma:prepare-frames -- --all --connect --dry-run --export-baselines",
    "  pnpm reflection:figma:prepare-frames -- --all --write",
    "  pnpm reflection:figma:prepare-frames -- --all --destination current --write",
    "  pnpm reflection:figma:prepare-frames -- --inspect-source-registry --connect --json",
    "  pnpm reflection:figma:prepare-frames -- --write-info-frames --replace --accept-any-file",
    "",
    "Options:",
    `  --root <path>          Reflection families root. Defaults to ${defaultFamiliesRoot}.`,
    `  --source-registry <path> Source frame registry. Defaults to ${defaultSourceRegistry}.`,
    "  --manifest <path>      Use one explicit legacy frame-prep manifest.",
    "  --all                  Use all reflection-contract prep entries under the families root.",
    "  --family <name>        Include one family. Can be repeated.",
    "  --case <caseId>        Include one case id.",
    "  --inspect-source-registry Inspect registry source frames instead of preparing cases.",
    "  --write-info-frames  Create source registry info frames in Figma. Implies --inspect-source-registry and --connect.",
    "  --destination <mode>   source-page, current, or named. Defaults to source-page.",
    "  --output-page <name>   Named output page when --destination named. Legacy 'current' selects current.",
    "  --dry-run              Validate and preview. This is the default.",
    "  --connect              Connect to Figma for selector validation without writing.",
    "  --write                Create frames in Figma. Implies --connect.",
    "  --replace              Replace existing frames created by this POC plugin.",
    "  --replace-unmanaged-reflection Replace same-name untagged reflection/* frames. Recovery only.",
    "  --export-baselines     Export generated reflection/* frames to family baselines. Dry-run unless --write is used.",
    "  --export-project <name> figma-node-fetch project for baseline export. Defaults to marwes.",
    "  --export-toolkit <path> Optional marwes-figma-toolkit/figma-node-fetch path.",
    "  --accept-any-file      Use the first connected Figma file even if the file key differs.",
    "  --host <host>          WebSocket host. Defaults to localhost.",
    "  --port <port>          Use one exact bridge port instead of scanning 9243-9252.",
    "  --timeout <ms>         Wait timeout. Defaults to 120000.",
    "  --json                 Print machine-readable output.",
    "  --help                 Show help.",
  ].join("\n")
}

function parseArgs(argv) {
  const options = {
    root: defaultFamiliesRoot,
    sourceRegistry: defaultSourceRegistry,
    manifests: [],
    all: false,
    families: [],
    caseId: undefined,
    outputPage: undefined,
    destination: undefined,
    destinationExplicit: false,
    write: false,
    connect: false,
    replace: false,
    replaceUnmanagedReflection: false,
    exportBaselines: false,
    exportProject: undefined,
    exportToolkit: undefined,
    acceptAnyFile: false,
    host: defaultHost,
    port: undefined,
    timeoutMs: 120000,
    json: false,
    help: false,
    inspectSourceRegistry: false,
    writeInfoFrames: false,
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]

    function readValue() {
      const value = argv[index + 1]
      if (!value || value.startsWith("--")) throw new Error(`Missing value for ${arg}`)
      index += 1
      return value
    }

    if (arg === "--help" || arg === "-h") options.help = true
    else if (arg === "--root") options.root = readValue()
    else if (arg === "--source-registry") options.sourceRegistry = readValue()
    else if (arg === "--manifest") options.manifests.push(readValue())
    else if (arg === "--all") options.all = true
    else if (arg === "--family") options.families.push(readValue())
    else if (arg === "--case") options.caseId = readValue()
    else if (arg === "--inspect-source-registry") options.inspectSourceRegistry = true
    else if (arg === "--write-info-frames") {
      options.inspectSourceRegistry = true
      options.writeInfoFrames = true
      options.connect = true
    } else if (arg === "--output-page") options.outputPage = readValue()
    else if (arg === "--destination") {
      options.destination = readValue()
      options.destinationExplicit = true
    } else if (arg === "--dry-run") options.write = false
    else if (arg === "--connect") options.connect = true
    else if (arg === "--write") {
      options.write = true
      options.connect = true
    } else if (arg === "--replace") options.replace = true
    else if (arg === "--replace-unmanaged-reflection") options.replaceUnmanagedReflection = true
    else if (arg === "--export-baselines") {
      options.exportBaselines = true
      options.connect = true
    } else if (arg === "--export-project") options.exportProject = readValue()
    else if (arg === "--export-toolkit") options.exportToolkit = readValue()
    else if (arg === "--accept-any-file") options.acceptAnyFile = true
    else if (arg === "--host") options.host = readValue()
    else if (arg === "--port") options.port = Number(readValue())
    else if (arg === "--timeout") options.timeoutMs = Number(readValue())
    else if (arg === "--json") options.json = true
    else throw new Error(`Unknown argument: ${arg}`)
  }

  if (options.port !== undefined && !Number.isInteger(options.port)) {
    throw new Error("--port must be an integer")
  }

  if (!Number.isInteger(options.timeoutMs) || options.timeoutMs <= 0) {
    throw new Error("--timeout must be a positive integer")
  }

  if (options.destination !== undefined && !supportedDestinations.has(options.destination)) {
    throw new Error(`--destination must be one of: ${[...supportedDestinations].join(", ")}`)
  }

  if (!options.destinationExplicit) {
    if (options.outputPage === "current") options.destination = "current"
    else if (options.outputPage) options.destination = "named"
    else options.destination = "source-page"
  }

  if (options.destination === "named" && options.outputPage === "current") {
    throw new Error("--output-page current cannot be used with --destination named")
  }

  if (
    !options.help &&
    !options.inspectSourceRegistry &&
    !options.all &&
    options.families.length === 0 &&
    options.manifests.length === 0
  ) {
    throw new Error("Choose --all, --family <name>, or --manifest <path>.")
  }

  return options
}

function log(options, message) {
  if (!options.json) console.log(message)
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"))
}

function absolute(path) {
  return resolve(repoRoot, path)
}

function listLegacyManifestPaths(options) {
  const explicit = options.manifests.map((path) => absolute(path))
  if (explicit.length > 0) return explicit

  const root = absolute(options.root)
  if (!existsSync(root)) throw new Error(`Missing families root: ${options.root}`)

  const familyFilter = new Set(options.families)
  return readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((family) => options.all || familyFilter.has(family))
    .map((family) => join(root, family, "frame-prep.json"))
    .filter((path) => existsSync(path))
    .sort((left, right) => left.localeCompare(right))
}

function listContractPaths(options) {
  if (options.manifests.length > 0) return []

  const root = absolute(options.root)
  if (!existsSync(root)) throw new Error(`Missing families root: ${options.root}`)

  return readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => join(root, entry.name, "reflection-contract.json"))
    .filter((path) => existsSync(path))
    .sort((left, right) => left.localeCompare(right))
}

function validateViewportSize(caseEntry, label) {
  const size = caseEntry.viewportSize
  if (
    !size ||
    !Number.isInteger(size.width) ||
    !Number.isInteger(size.height) ||
    size.width <= 0 ||
    size.height <= 0
  ) {
    throw new Error(`${label} viewportSize must contain positive integer width and height`)
  }
}

function validateSelector(selector, modeEntry, label) {
  if (!selector || typeof selector !== "object") {
    throw new Error(`${label} selector must be an object`)
  }

  if (!supportedStrategies.has(selector.strategy)) {
    throw new Error(
      `${label} selector.strategy must be one of: ${[...supportedStrategies].join(", ")}`,
    )
  }

  if (selector.strategy === "directNode") {
    if (!modeEntry.sourceNodeId && !selector.sourceNodeId) {
      throw new Error(`${label} directNode selector requires sourceNodeId`)
    }
    return
  }

  if (!modeEntry.sourceFrameId || typeof modeEntry.sourceFrameId !== "string") {
    throw new Error(`${label} ${selector.strategy} selector requires sourceFrameId`)
  }

  if (!selector.rowName || typeof selector.rowName !== "string") {
    throw new Error(`${label} ${selector.strategy} selector requires rowName`)
  }

  if (!selector.childName || typeof selector.childName !== "string") {
    throw new Error(`${label} ${selector.strategy} selector requires childName`)
  }
}

function validateFrameName(name, family, mode, label) {
  if (!name || typeof name !== "string") {
    throw new Error(`${label} outputFrameName must be a string`)
  }

  if (!name.startsWith(`reflection/${family}/`)) {
    throw new Error(`${label} outputFrameName must start with reflection/${family}/`)
  }

  if (!name.endsWith(`/${mode}`)) {
    throw new Error(`${label} outputFrameName must end with /${mode}`)
  }
}

function nodeIdToUrlNodeId(nodeId) {
  return nodeId.replace(":", "-")
}

function validateFigmaNodeUrl(url, figmaFileKey, nodeId, label, fieldName) {
  if (url === undefined) return
  if (!url || typeof url !== "string") {
    throw new Error(`${label} ${fieldName} must be a string`)
  }

  let parsed
  try {
    parsed = new URL(url)
  } catch (_error) {
    throw new Error(`${label} ${fieldName} must be a valid URL`)
  }

  const isFigmaHost = parsed.hostname === "figma.com" || parsed.hostname === "www.figma.com"
  if (!isFigmaHost) throw new Error(`${label} ${fieldName} must use figma.com`)

  if (!parsed.pathname.includes(`/${figmaFileKey}/`)) {
    throw new Error(`${label} ${fieldName} must point to Figma file ${figmaFileKey}`)
  }

  const urlNodeId = parsed.searchParams.get("node-id")
  const expectedNodeId = nodeIdToUrlNodeId(nodeId)
  if (urlNodeId !== expectedNodeId) {
    throw new Error(`${label} ${fieldName} node-id must be ${expectedNodeId}`)
  }
}

function normalizeSourceRegistry(registry, registryPath, options) {
  if (registry.schemaVersion !== 1) {
    throw new Error(`${registryPath} schemaVersion must be 1`)
  }

  if (!registry.figmaFileKey || typeof registry.figmaFileKey !== "string") {
    throw new Error(`${registryPath} figmaFileKey must be a string`)
  }

  if (!registry.families || typeof registry.families !== "object") {
    throw new Error(`${registryPath} families must be an object`)
  }

  const familyFilter = new Set(options.families)
  const entries = []

  for (const family of Object.keys(registry.families).sort((left, right) =>
    left.localeCompare(right),
  )) {
    if (familyFilter.size > 0 && !familyFilter.has(family)) continue

    const familyEntry = registry.families[family]
    for (const mode of defaultModes) {
      const modeEntry = familyEntry[mode]
      if (!modeEntry) continue

      const label = `${family}:${mode}`
      if (!modeEntry.sourceFrameId || typeof modeEntry.sourceFrameId !== "string") {
        throw new Error(`${label} sourceFrameId must be a string`)
      }

      validateFigmaNodeUrl(
        modeEntry.sourceFrameUrl,
        registry.figmaFileKey,
        modeEntry.sourceFrameId,
        label,
        "sourceFrameUrl",
      )

      entries.push({
        family,
        mode,
        sourceFrameId: modeEntry.sourceFrameId,
        sourceFrameUrl: modeEntry.sourceFrameUrl,
      })
    }
  }

  if (entries.length === 0) {
    throw new Error("No source registry entries matched the selection.")
  }

  return {
    figmaFileKey: registry.figmaFileKey,
    registryPath,
    entries,
  }
}

function buildSourceRegistryPlan(options) {
  const registryPath = absolute(options.sourceRegistry)
  if (!existsSync(registryPath))
    throw new Error(`Missing source registry: ${options.sourceRegistry}`)
  return normalizeSourceRegistry(readJson(registryPath), registryPath, options)
}

function mergeSelector(caseSelector, modeEntry) {
  const selector = { ...(caseSelector ?? {}), ...(modeEntry.selector ?? {}) }
  if (modeEntry.sourceNodeId) selector.sourceNodeId = modeEntry.sourceNodeId
  return selector
}

function reflectionFamilyFromPath(value, fallback) {
  const match = String(value ?? "").match(/^\/?reflection\/([^/]+)\//u)
  return match?.[1] ?? fallback
}

function selectedPrepFamily(options, family) {
  if (options.families.length === 0) return options.all
  return options.families.includes(family)
}

function normalizeManifest(manifest, manifestPath, options) {
  if (manifest.schemaVersion !== 1) {
    throw new Error(`${manifestPath} schemaVersion must be 1`)
  }

  if (!manifest.family || typeof manifest.family !== "string") {
    throw new Error(`${manifestPath} family must be a string`)
  }

  if (!manifest.figmaFileKey || typeof manifest.figmaFileKey !== "string") {
    throw new Error(`${manifestPath} figmaFileKey must be a string`)
  }

  if (!Array.isArray(manifest.cases)) {
    throw new Error(`${manifestPath} cases must be an array`)
  }

  const frames = []

  for (const caseEntry of manifest.cases) {
    if (!caseEntry.caseId || typeof caseEntry.caseId !== "string") {
      throw new Error(`${manifestPath} contains a case without caseId`)
    }

    if (options.caseId && caseEntry.caseId !== options.caseId) continue
    validateViewportSize(caseEntry, `${manifest.family}:${caseEntry.caseId}`)

    const modes = caseEntry.modes ?? {}
    for (const mode of defaultModes) {
      const modeEntry = modes[mode]
      if (!modeEntry) continue

      const label = `${manifest.family}:${caseEntry.caseId}:${mode}`
      const selector = mergeSelector(caseEntry.selector, modeEntry)
      validateSelector(selector, modeEntry, label)
      validateFrameName(modeEntry.outputFrameName, manifest.family, mode, label)
      validateFigmaNodeUrl(
        modeEntry.sourceFrameUrl,
        manifest.figmaFileKey,
        modeEntry.sourceFrameId,
        label,
        "sourceFrameUrl",
      )
      validateFigmaNodeUrl(
        modeEntry.sourceNodeUrl,
        manifest.figmaFileKey,
        modeEntry.sourceNodeId,
        label,
        "sourceNodeUrl",
      )

      frames.push({
        family: manifest.family,
        contractFamily: manifest.family,
        caseId: caseEntry.caseId,
        mode,
        viewport: caseEntry.viewport,
        viewportSize: caseEntry.viewportSize,
        sourceFrameId: modeEntry.sourceFrameId,
        sourceFrameUrl: modeEntry.sourceFrameUrl,
        sourceNodeId: modeEntry.sourceNodeId,
        sourceNodeUrl: modeEntry.sourceNodeUrl,
        outputFrameName: modeEntry.outputFrameName,
        framing: modeEntry.framing ?? caseEntry.framing ?? {},
        selector,
      })
    }
  }

  return {
    family: manifest.family,
    figmaFileKey: manifest.figmaFileKey,
    outputPage: manifest.outputPage ?? "Reflection Baselines",
    frames,
  }
}

function normalizeContractPrep(contract, contractPath, options) {
  if (contract.schemaVersion !== 1) {
    throw new Error(`${contractPath} schemaVersion must be 1`)
  }

  if (!contract.family || typeof contract.family !== "string") {
    throw new Error(`${contractPath} family must be a string`)
  }

  if (!contract.figmaFileKey || typeof contract.figmaFileKey !== "string") {
    throw new Error(`${contractPath} figmaFileKey must be a string`)
  }

  if (!Array.isArray(contract.cases)) {
    throw new Error(`${contractPath} cases must be an array`)
  }

  const frames = []

  for (const caseEntry of contract.cases) {
    if (options.caseId && caseEntry.caseId !== options.caseId) continue
    if (!caseEntry.prep) continue

    const mode = caseEntry.mode
    const label = `${contract.family}:${caseEntry.caseId}:${mode}`
    if (!defaultModes.includes(mode)) {
      throw new Error(`${label} mode must be one of: ${defaultModes.join(", ")}`)
    }

    validateViewportSize(caseEntry, `${contract.family}:${caseEntry.caseId}`)

    const outputFrameName = caseEntry.prep.outputFrameName ?? caseEntry.figmaFrameName
    const prepFamily = reflectionFamilyFromPath(outputFrameName, contract.family)
    if (!selectedPrepFamily(options, prepFamily)) continue

    const modeEntry = {
      sourceFrameId: caseEntry.prep.sourceFrameId,
      sourceFrameUrl: caseEntry.prep.sourceFrameUrl,
      sourceNodeId: caseEntry.prep.sourceNodeId,
      sourceNodeUrl: caseEntry.prep.sourceNodeUrl,
      outputFrameName,
      selector: caseEntry.prep.selector,
      framing: caseEntry.prep.framing,
    }
    const selector = mergeSelector(undefined, modeEntry)

    validateSelector(selector, modeEntry, label)
    validateFrameName(outputFrameName, prepFamily, mode, label)
    validateFigmaNodeUrl(
      modeEntry.sourceFrameUrl,
      contract.figmaFileKey,
      modeEntry.sourceFrameId,
      label,
      "prep.sourceFrameUrl",
    )
    validateFigmaNodeUrl(
      modeEntry.sourceNodeUrl,
      contract.figmaFileKey,
      modeEntry.sourceNodeId,
      label,
      "prep.sourceNodeUrl",
    )

    frames.push({
      family: prepFamily,
      contractFamily: contract.family,
      caseId: caseEntry.caseId,
      mode,
      viewport: caseEntry.viewport,
      viewportSize: caseEntry.viewportSize,
      sourceFrameId: modeEntry.sourceFrameId,
      sourceFrameUrl: modeEntry.sourceFrameUrl,
      sourceNodeId: modeEntry.sourceNodeId,
      sourceNodeUrl: modeEntry.sourceNodeUrl,
      outputFrameName,
      framing: modeEntry.framing ?? caseEntry.framing ?? {},
      selector,
    })
  }

  return {
    family: contract.family,
    figmaFileKey: contract.figmaFileKey,
    outputPage: "Reflection Baselines",
    frames,
    sourceType: "reflection-contract",
    sourcePath: contractPath,
  }
}

function buildPlan(options) {
  const contractPaths = listContractPaths(options)
  const contractManifests = contractPaths
    .map((path) => normalizeContractPrep(readJson(path), path, options))
    .filter((manifest) => manifest.frames.length > 0)
  const contractFrameNames = new Set(
    contractManifests.flatMap((manifest) => manifest.frames.map((frame) => frame.outputFrameName)),
  )

  const legacyManifestPaths = listLegacyManifestPaths(options)
  const legacyManifests = legacyManifestPaths
    .map((path) => {
      const manifest = normalizeManifest(readJson(path), path, options)
      return {
        ...manifest,
        sourceType: "legacy-frame-prep",
        sourcePath: path,
        frames: manifest.frames.filter((frame) => !contractFrameNames.has(frame.outputFrameName)),
      }
    })
    .filter((manifest) => manifest.frames.length > 0)
  const manifests = [...contractManifests, ...legacyManifests]
  const warnings =
    legacyManifests.length > 0
      ? [
          "Using legacy frame-prep.json fallback for at least one case. Run pnpm governance:migrate-contracts -- --write to move prep metadata into reflection-contract.json.",
        ]
      : []
  const manifestPaths = manifests.map((manifest) => manifest.sourcePath ?? "unknown")

  if (manifests.length === 0) {
    throw new Error("No reflection contract prep entries or legacy frame-prep manifests matched.")
  }

  const fileKeys = [...new Set(manifests.map((manifest) => manifest.figmaFileKey))]
  const outputPages = [...new Set(manifests.map((manifest) => manifest.outputPage))]

  if (fileKeys.length !== 1) {
    throw new Error(`Selected manifests use multiple figmaFileKey values: ${fileKeys.join(", ")}`)
  }

  if (options.destination === "named" && outputPages.length !== 1 && !options.outputPage) {
    throw new Error(`Selected manifests use multiple outputPage values: ${outputPages.join(", ")}`)
  }

  const frames = manifests.flatMap((manifest) => manifest.frames)
  if (frames.length === 0) throw new Error("No frame prep cases matched the selection.")

  return {
    figmaFileKey: fileKeys[0],
    outputPage: options.outputPage ?? outputPages[0],
    destination: options.destination,
    manifestPaths,
    warnings,
    frames,
  }
}

function printOfflinePlan(plan, options) {
  log(options, `Reflection frame prep plan: ${plan.frames.length} frame(s)`)
  log(options, `Figma file key: ${plan.figmaFileKey}`)
  log(options, `Destination: ${plan.destination}`)
  if (plan.destination === "named") log(options, `Output page: ${plan.outputPage}`)
  for (const warning of plan.warnings ?? []) log(options, `Warning: ${warning}`)
  log(options, "")

  for (const frame of plan.frames) {
    const selector = frame.selector.strategy
    log(
      options,
      `[plan] ${frame.family} ${frame.caseId} ${frame.mode} -> ${frame.outputFrameName} (${frame.viewportSize.width}x${frame.viewportSize.height}, ${selector})`,
    )
  }

  log(options, "")
  log(
    options,
    "Offline dry run only. Add --connect to validate selectors in Figma, or --write to create frames.",
  )
}

function caseSlug(family, caseId) {
  const prefix = `${family}.`
  const withoutFamily = caseId.startsWith(prefix) ? caseId.slice(prefix.length) : caseId
  return withoutFamily.replaceAll(".", "-")
}

function buildPlanFrameIndex(plan) {
  const index = new Map()
  for (const frame of plan.frames) {
    index.set(frame.outputFrameName, frame)
  }
  return index
}

function collectExportableFrameEntries(result, plan, options) {
  const frameIndex = buildPlanFrameIndex(plan)
  const sourceEntries = options.write
    ? [...(result.created ?? []), ...(result.replaced ?? []), ...(result.upToDate ?? [])]
    : (result.planned ?? [])
  const entries = []
  const issues = []

  for (const entry of sourceEntries) {
    const frame = frameIndex.get(entry.outputFrameName)
    if (!frame) {
      issues.push(`${entry.outputFrameName} was not found in the frame-prep plan`)
      continue
    }

    if (!entry.figmaNodeId) {
      issues.push(`${entry.outputFrameName} does not have a generated Figma node id`)
      continue
    }

    if (!options.write && entry.action !== "none") {
      issues.push(`${entry.outputFrameName} is not export-ready in dry-run mode (${entry.action})`)
      continue
    }

    entries.push({
      caseId: frame.caseId,
      family: frame.family,
      contractFamily: frame.contractFamily ?? frame.family,
      mode: frame.mode,
      figmaFileKey: plan.figmaFileKey,
      figmaNodeId: entry.figmaNodeId,
      figmaFrameName: frame.outputFrameName,
      sourceFrameId: frame.sourceFrameId,
      baseline: `${frame.family}/baselines/${caseSlug(frame.family, frame.caseId)}.chromium-linux.${frame.mode}.png`,
      viewport: frame.viewport,
      viewportSize: frame.viewportSize,
      framing: frame.framing,
      exportScale: 1,
      requestHash: entry.requestHash,
      sourceFingerprint: entry.sourceFingerprint,
      destinationPageId: entry.destinationPageId,
      destinationPageName: entry.destinationPageName,
      position: entry.position,
      placementAnchor: entry.placementAnchor,
      status: entry.status,
      reason: entry.reason,
    })
  }

  if (issues.length > 0) {
    throw new Error(`Cannot export baselines:\n- ${issues.join("\n- ")}`)
  }

  if (entries.length === 0)
    throw new Error("No generated Reflection frames were available to export.")
  return entries
}

function readPngDimensions(buffer) {
  const signature = buffer.subarray(0, 8).toString("hex")
  if (signature !== "89504e470d0a1a0a") {
    throw new Error("Exported file is not a PNG")
  }

  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  }
}

function resolveInside(root, relativePath) {
  const resolvedRoot = resolve(root)
  const resolvedPath = resolve(resolvedRoot, relativePath)
  const rootPrefix = resolvedRoot.endsWith(sep) ? resolvedRoot : `${resolvedRoot}${sep}`
  if (resolvedPath !== resolvedRoot && !resolvedPath.startsWith(rootPrefix)) {
    throw new Error(`Refusing to write outside baseline root: ${relativePath}`)
  }
  return resolvedPath
}

async function runBridgeBaselineExport(server, client, result, plan, options) {
  const cases = collectExportableFrameEntries(result, plan, options)

  if (!options.write) {
    return {
      dryRun: true,
      cases,
      written: [],
    }
  }

  const exportResult = await server.sendCommand(
    client,
    "EXPORT_REFLECTION_FRAMES",
    { frames: cases },
    options.timeoutMs,
  )

  if (!exportResult?.success) {
    throw new Error(
      `Bridge baseline export failed: ${JSON.stringify({
        missing: exportResult?.missing ?? [],
        errors: exportResult?.errors ?? [],
      })}`,
    )
  }

  const baselineRoot = resolve(repoRoot, "packages/design-governance/reflection-families")
  const caseIndex = new Map(cases.map((entry) => [entry.baseline, entry]))
  const receiptContext = loadDesignSource(repoRoot)
  const written = []
  const exportedByFamily = new Map()

  for (const exported of exportResult.exported ?? []) {
    const entry = caseIndex.get(exported.baseline)
    if (!entry) throw new Error(`Unexpected exported baseline: ${exported.baseline}`)

    const buffer = Buffer.from(exported.pngBase64, "base64")
    const dimensions = readPngDimensions(buffer)
    if (
      dimensions.width !== entry.viewportSize.width ||
      dimensions.height !== entry.viewportSize.height
    ) {
      throw new Error(
        `${entry.caseId} exported ${dimensions.width}x${dimensions.height}, expected ${entry.viewportSize.width}x${entry.viewportSize.height}. Resize the Figma frame or update viewportSize before committing the baseline.`,
      )
    }

    const destination = resolveInside(baselineRoot, entry.baseline)
    await mkdir(dirname(destination), { recursive: true })
    await writeFile(destination, buffer)
    const contractEntry = loadReflectionContract(repoRoot, entry.contractFamily)
    const caseEntry = contractEntry
      ? findContractCase(contractEntry.contract, entry.caseId, entry.mode)
      : undefined

    if (!contractEntry) {
      throw new Error(`Could not find reflection contract for ${entry.contractFamily}`)
    }

    if (!caseEntry) {
      throw new Error(`Could not find contract case ${entry.caseId} ${entry.mode}`)
    }

    const receipt = await writeBaselineReceipt({
      repoRoot,
      contract: contractEntry.contract,
      caseEntry,
      context: receiptContext,
      pngPath: destination,
      origin: "figma-bridge-export",
      sourceFrameId: entry.sourceFrameId,
    })
    if (!exportedByFamily.has(entry.contractFamily)) exportedByFamily.set(entry.contractFamily, [])
    exportedByFamily.get(entry.contractFamily).push(entry)
    written.push({
      caseId: entry.caseId,
      family: entry.family,
      mode: entry.mode,
      path: destination,
      receiptPath: receipt.receiptPath,
      receiptChanged: receipt.changed,
      dimensions,
      byteLength: buffer.length,
    })
  }

  const provenance = []
  for (const [family, entries] of exportedByFamily.entries()) {
    provenance.push(
      await writeGeneratedFrameProvenance({
        repoRoot,
        family,
        context: receiptContext,
        entries,
      }),
    )
  }

  return {
    dryRun: false,
    cases,
    written,
    provenance,
    exported: exportResult.exported?.length ?? 0,
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
      clearTimeout(pending.timeout)
      this.pendingRequests.delete(message.id)

      if (message.error && !message.result) {
        pending.reject(
          new Error(`${message.error}. Recent bridge events: ${this.describeEvents()}`),
        )
      } else pending.resolve(message.result)
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

    if (message.type === "STATUS") {
      this.recordEvent(`plugin status: ${message.message ?? "unknown status"}`)
      return
    }
  }

  sendCommand(client, method, params = {}, timeoutMs = 30000) {
    return new Promise((resolveCommand, rejectCommand) => {
      const id = `marwes_reflection_${++this.requestId}_${Date.now()}`
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
    } catch (_error) {
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

function summarizeResult(result) {
  return {
    success: Boolean(result?.success),
    dryRun: Boolean(result?.dryRun),
    replace: Boolean(result?.replace),
    destination: result?.destination ?? "source-page",
    total: result?.total ?? 0,
    planned: result?.planned?.filter((entry) => entry.type !== "outputPage").length ?? 0,
    created: result?.created?.length ?? 0,
    replaced: result?.replaced?.length ?? 0,
    movedFromPage: result?.movedFromPage?.length ?? 0,
    upToDate: result?.upToDate?.length ?? 0,
    conflicts: result?.conflicts?.length ?? 0,
    missing: result?.missing?.length ?? 0,
    errors: result?.errors?.length ?? 0,
  }
}

function summarizeSourceRegistryResult(result) {
  return {
    success: Boolean(result?.success),
    dryRun: Boolean(result?.dryRun),
    writeInfoFrames: Boolean(result?.writeInfoFrames),
    total: result?.total ?? 0,
    found: result?.found?.length ?? 0,
    planned: result?.planned?.length ?? 0,
    created: result?.created?.length ?? 0,
    replaced: result?.replaced?.length ?? 0,
    upToDate: result?.upToDate?.length ?? 0,
    conflicts: result?.conflicts?.length ?? 0,
    missing: result?.missing?.length ?? 0,
    errors: result?.errors?.length ?? 0,
  }
}

async function waitForBridgeClient(server, plan, options) {
  let client
  try {
    client = await server.waitForClient(plan.figmaFileKey, options.timeoutMs, options.acceptAnyFile)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(
      `${message}. Observed bridge clients: ${server.describeClients()}. Recent bridge events: ${server.describeEvents()}`,
    )
  }

  return client
}

async function runSourceRegistryConnected(plan, options) {
  const server = new BridgeServer({ host: options.host, port: options.port })

  try {
    const port = await server.start()
    log(options, `Prepared ${plan.entries.length} source frame registry request(s).`)
    log(options, `Figma reflection bridge waiting on ws://${options.host}:${port}`)
    log(options, "Open Figma Desktop with the Marwes file, then run:")
    log(options, "Plugins > Development > Marwes Reflection Frame Prep")
    log(options, `Expected file key: ${plan.figmaFileKey}`)

    const client = await waitForBridgeClient(server, plan, options)
    const connectedFileName = client.fileInfo?.fileName ?? "Figma file"
    const connectedFileKey = client.fileInfo?.fileKey ?? "no file key reported"
    log(options, `Connected to ${connectedFileName} (${connectedFileKey})`)

    const result = await server.sendCommand(
      client,
      "INSPECT_SOURCE_FRAME_REGISTRY",
      {
        fileKey: options.acceptAnyFile ? undefined : plan.figmaFileKey,
        entries: plan.entries,
        writeInfoFrames: options.writeInfoFrames,
        dryRun: !options.writeInfoFrames,
        replace: options.replace,
      },
      options.timeoutMs,
    )

    const summary = summarizeSourceRegistryResult(result)

    if (options.json) {
      console.log(JSON.stringify({ ...summary, details: result }, null, 2))
    } else {
      log(options, "")
      log(
        options,
        summary.writeInfoFrames && !summary.dryRun
          ? `Created ${summary.created} source info frame(s); replaced ${summary.replaced}; up-to-date ${summary.upToDate}.`
          : `Inspected ${summary.total} source frame(s); found ${summary.found}; planned ${summary.planned}; missing ${summary.missing}; errors ${summary.errors}.`,
      )
    }

    if (!summary.success) process.exitCode = 1
  } finally {
    await server.close()
  }
}

async function runConnected(plan, options) {
  const server = new BridgeServer({ host: options.host, port: options.port })

  try {
    const port = await server.start()
    log(options, `Prepared ${plan.frames.length} Reflection frame request(s).`)
    log(options, `Figma reflection bridge waiting on ws://${options.host}:${port}`)
    log(options, "Open Figma Desktop with the Marwes file, then run:")
    log(options, "Plugins > Development > Marwes Reflection Frame Prep")
    log(options, `Expected file key: ${plan.figmaFileKey}`)
    log(options, `Destination: ${plan.destination}`)
    if (!options.write)
      log(options, "Mode: connected dry run. Re-run with --write to create frames.")

    const client = await waitForBridgeClient(server, plan, options)
    const connectedFileName = client.fileInfo?.fileName ?? "Figma file"
    const connectedFileKey = client.fileInfo?.fileKey ?? "no file key reported"
    log(options, `Connected to ${connectedFileName} (${connectedFileKey})`)

    const result = await server.sendCommand(
      client,
      "PREPARE_REFLECTION_FRAMES",
      {
        fileKey: options.acceptAnyFile ? undefined : plan.figmaFileKey,
        outputPage: plan.outputPage,
        destination: plan.destination,
        dryRun: !options.write,
        replace: options.replace,
        replaceUnmanagedReflection: options.replaceUnmanagedReflection,
        frames: plan.frames,
      },
      options.timeoutMs,
    )

    const summary = summarizeResult(result)
    let baselineExport

    if (summary.success && options.exportBaselines) {
      baselineExport = await runBridgeBaselineExport(server, client, result, plan, options)
    }

    if (options.json) {
      console.log(
        JSON.stringify(
          { ...summary, warnings: plan.warnings, baselineExport, details: result },
          null,
          2,
        ),
      )
    } else {
      log(options, "")
      log(
        options,
        summary.dryRun
          ? `Previewed ${summary.planned} frame(s).`
          : `Created ${summary.created} frame(s); replaced ${summary.replaced}; moved ${summary.movedFromPage}; up-to-date ${summary.upToDate}.`,
      )
      log(
        options,
        `Conflicts: ${summary.conflicts}; missing: ${summary.missing}; errors: ${summary.errors}`,
      )
      for (const warning of plan.warnings ?? []) log(options, `Warning: ${warning}`)
      if (summary.dryRun) {
        log(options, "No Figma changes were made. Re-run with --write to create frames.")
      }
      if (baselineExport) {
        log(
          options,
          baselineExport.dryRun
            ? `Baseline export dry-run planned ${baselineExport.cases.length} PNG(s).`
            : `Exported ${baselineExport.cases.length} baseline PNG(s).`,
        )
      }
    }

    if (!summary.success) process.exitCode = 1
  } finally {
    await server.close()
  }
}

async function main(argv) {
  const options = parseArgs(argv)
  if (options.help) {
    console.log(usage())
    return
  }

  if (options.inspectSourceRegistry) {
    const plan = buildSourceRegistryPlan(options)

    if (!options.connect && !options.write) {
      if (options.json) {
        console.log(
          JSON.stringify(
            {
              success: true,
              mode: "offline",
              dryRun: true,
              fileKey: plan.figmaFileKey,
              total: plan.entries.length,
              registry: relative(repoRoot, plan.registryPath),
              entries: plan.entries,
            },
            null,
            2,
          ),
        )
      } else {
        log(options, `Source frame registry plan: ${plan.entries.length} source frame(s)`)
        log(options, `Figma file key: ${plan.figmaFileKey}`)
        log(options, `Registry: ${relative(repoRoot, plan.registryPath)}`)
        log(options, "")
        for (const entry of plan.entries) {
          log(options, `[plan] ${entry.family} ${entry.mode} -> ${entry.sourceFrameId}`)
        }
        log(options, "")
        log(options, "Offline dry run only. Add --connect to inspect source frames in Figma.")
      }
      return
    }

    await runSourceRegistryConnected(plan, options)
    return
  }

  const plan = buildPlan(options)

  if (!options.connect && !options.write) {
    if (options.json) {
      console.log(
        JSON.stringify(
          {
            success: true,
            mode: "offline",
            dryRun: true,
            fileKey: plan.figmaFileKey,
            outputPage: plan.outputPage,
            destination: plan.destination,
            total: plan.frames.length,
            manifests: plan.manifestPaths.map((path) => relative(repoRoot, path)),
            warnings: plan.warnings,
            frames: plan.frames,
          },
          null,
          2,
        ),
      )
    } else {
      printOfflinePlan(plan, options)
    }
    return
  }

  await runConnected(plan, options)
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
