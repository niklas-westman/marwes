import { createHash } from "node:crypto"
import { existsSync, readFileSync, readdirSync } from "node:fs"
import { mkdir, readFile, stat, writeFile } from "node:fs/promises"
import { dirname, resolve, sep } from "node:path"
import { fileURLToPath } from "node:url"

export const baselineReceiptSchemaVersion = 1
export const baselineReceiptOrigins = new Set([
  "figma-bridge-export",
  "local-export-compile",
  "receipt-backfill",
])

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..")
export const defaultRepoRoot = resolve(packageRoot, "../..")
export const defaultTargetConfigPath = ".pi/figma-sync.json"
export const defaultReflectionFamiliesRoot = "packages/design-governance/reflection-families"
export const defaultSourceRegistryPath =
  "packages/design-governance/reflection-families/source-frame-registry.json"

export function absolute(repoRoot, path) {
  return resolve(repoRoot, path)
}

export function pathExists(repoRoot, path) {
  return existsSync(absolute(repoRoot, path))
}

export function readJsonFile(path) {
  return JSON.parse(readFileSync(path, "utf8"))
}

export function readJson(repoRoot, path) {
  return readJsonFile(absolute(repoRoot, path))
}

export async function pathExistsAbsolute(path) {
  try {
    await stat(path)
    return true
  } catch {
    return false
  }
}

export function normalizeTokenName(name) {
  return String(name)
    .replace(/\\/g, "/")
    .replace(/\s*\/\s*/g, "/")
    .trim()
    .toLowerCase()
}

export function stableValue(value) {
  if (Array.isArray(value)) return value.map((item) => stableValue(item))
  if (!value || typeof value !== "object") return value

  return Object.keys(value)
    .sort((left, right) => left.localeCompare(right))
    .reduce((output, key) => {
      const child = value[key]
      if (child !== undefined) output[key] = stableValue(child)
      return output
    }, {})
}

export function stableStringify(value) {
  return JSON.stringify(stableValue(value), null, 2)
}

export function formatReceiptJson(receipt) {
  return `${stableStringify(receipt).replace(
    /"sourceNodeIds": \[\n((?: {4}"[^"]+",?\n)+) {2}\]/gu,
    (_match, rawItems) => {
      const items = rawItems
        .trim()
        .split(/\n/u)
        .map((line) => line.trim().replace(/,$/u, ""))
      return `"sourceNodeIds": [${items.join(", ")}]`
    },
  )}\n`
}

export function sha256Buffer(buffer) {
  return createHash("sha256").update(buffer).digest("hex")
}

export function sha256Json(value) {
  return createHash("sha256").update(stableStringify(value)).digest("hex")
}

export function readPngInfoFromBuffer(buffer, label = "PNG") {
  const signature = buffer.subarray(0, 8).toString("hex")
  if (signature !== "89504e470d0a1a0a") {
    throw new Error(`${label} is not a PNG`)
  }

  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
    byteLength: buffer.length,
    sha256: sha256Buffer(buffer),
  }
}

export function readPngInfo(path) {
  return readPngInfoFromBuffer(readFileSync(path), path)
}

// Canonical references permit PNG and single-frame lossless WebP only.
export function readBaselineInfoFromBuffer(buffer, label = "Baseline") {
  if (buffer.subarray(0, 8).toString("hex") === "89504e470d0a1a0a") {
    if (buffer.length < 24 || buffer.toString("ascii", 12, 16) !== "IHDR")
      throw new Error(`${label} has no PNG dimensions`)
    const info = readPngInfoFromBuffer(buffer, label)
    if (!info.width || !info.height) throw new Error(`${label} has invalid dimensions`)
    return { ...info, format: "png" }
  }
  if (
    buffer.length < 20 ||
    buffer.toString("ascii", 0, 4) !== "RIFF" ||
    buffer.toString("ascii", 8, 12) !== "WEBP" ||
    buffer.readUInt32LE(4) + 8 !== buffer.length
  )
    throw new Error(`${label} must be PNG or lossless WebP`)
  let dimensions
  for (let offset = 12; offset < buffer.length; ) {
    if (offset + 8 > buffer.length) throw new Error(`${label} has truncated WebP chunks`)
    const type = buffer.toString("ascii", offset, offset + 4)
    const length = buffer.readUInt32LE(offset + 4)
    const end = offset + 8 + length
    if (end + (length % 2) > buffer.length) throw new Error(`${label} has truncated WebP data`)
    if (type === "VP8 " || type === "ANIM" || type === "ANMF")
      throw new Error(`${label} must be single-frame lossless WebP`)
    if (type === "VP8L") {
      if (dimensions || length < 5 || buffer[offset + 8] !== 0x2f)
        throw new Error(`${label} has invalid lossless WebP data`)
      const bits = buffer.readUInt32LE(offset + 9)
      if (bits >>> 29) throw new Error(`${label} has unsupported WebP version`)
      dimensions = { width: (bits & 0x3fff) + 1, height: ((bits >>> 14) & 0x3fff) + 1 }
    }
    offset = end + (length % 2)
  }
  if (!dimensions) throw new Error(`${label} has no lossless WebP image`)
  return { ...dimensions, byteLength: buffer.length, sha256: sha256Buffer(buffer), format: "webp" }
}

export function readBaselineInfo(path) {
  const info = readBaselineInfoFromBuffer(readFileSync(path), path)
  if (!path.endsWith(`.${info.format}`))
    throw new Error(`Baseline extension does not match ${info.format}: ${path}`)
  return info
}

export function receiptImageIdentity(receipt) {
  return receipt.schemaVersion === 2
    ? {
        sha256: receipt.imageSha256,
        byteLength: receipt.imageByteLength,
        dimensions: receipt.imageDimensions,
      }
    : {
        sha256: receipt.pngSha256,
        byteLength: receipt.pngByteLength,
        dimensions: receipt.pngDimensions,
      }
}

export function receiptPathForBaselinePath(path) {
  if (!/\.(png|webp)$/u.test(path))
    throw new Error(`Baseline path must end with .png or .webp: ${path}`)
  return path.replace(/\.(png|webp)$/u, ".meta.json")
}

export function extractFileKey(figmaFile) {
  return figmaFile?.match(/figma\.com\/(?:file|design)\/([^/?#]+)/)?.[1]
}

export function readSyncTarget(repoRoot = defaultRepoRoot) {
  if (!pathExists(repoRoot, defaultTargetConfigPath)) {
    throw new Error(`Missing ${defaultTargetConfigPath}`)
  }

  const syncConfig = readJson(repoRoot, defaultTargetConfigPath)
  const targetName = syncConfig.defaultTarget
  const target = syncConfig.targets?.[targetName]

  if (!target) {
    throw new Error(`Unknown Figma sync target: ${targetName}`)
  }

  return {
    name: targetName,
    liveDir: target.liveDir,
    figmaFile: target.figmaFile,
    fileKey: extractFileKey(target.figmaFile),
  }
}

export function findRawFigmaFile(repoRoot, target) {
  const rawDir = absolute(repoRoot, `${target.liveDir}/_raw`)
  if (!existsSync(rawDir)) return undefined

  const rawFile = `${target.liveDir}/_raw/${target.fileKey}_full.json`
  return target.fileKey && pathExists(repoRoot, rawFile) ? rawFile : undefined
}

export function loadDesignSource(repoRoot = defaultRepoRoot) {
  const target = readSyncTarget(repoRoot)
  const rawFile = findRawFigmaFile(repoRoot, target)
  const variableMapPath = `${target.liveDir}/tokens/variables.json`

  if (!rawFile) throw new Error(`Missing raw Figma JSON in ${target.liveDir}/_raw`)
  if (!pathExists(repoRoot, variableMapPath)) throw new Error(`Missing ${variableMapPath}`)

  return {
    target,
    rawFile,
    rawSource: readJson(repoRoot, rawFile),
    variableMapPath,
    variableSource: readJson(repoRoot, variableMapPath),
  }
}

export function loadVariableMap(source) {
  const variables = Array.isArray(source.variables)
    ? source.variables
    : Object.values(source.variables ?? source)
  const map = new Map()
  const byNormalizedName = new Map()

  for (const variable of variables) {
    if (!variable || typeof variable !== "object") continue

    const id = variable.id ?? variable.variableId ?? variable.key
    const name = variable.name ?? variable.path ?? variable.token ?? variable.tokenName

    if (typeof id !== "string" || typeof name !== "string") continue

    const normalizedName = normalizeTokenName(name)
    const entry = {
      id,
      name,
      normalizedName,
      raw: variable,
    }
    map.set(id, entry)
    if (!byNormalizedName.has(normalizedName)) byNormalizedName.set(normalizedName, [])
    byNormalizedName.get(normalizedName).push(entry)
  }

  return { source, map, byNormalizedName }
}

export function findNodeById(source, id) {
  let found

  function walk(value) {
    if (!value || found) return

    if (Array.isArray(value)) {
      for (const item of value) walk(item)
      return
    }

    if (typeof value !== "object") return

    if (value.id === id) {
      found = value
      return
    }

    for (const child of Object.values(value)) {
      walk(child)
    }
  }

  walk(source.document ?? source)
  return found
}

export function collectVariableIds(value, output = new Set()) {
  if (!value) return output

  if (Array.isArray(value)) {
    for (const item of value) collectVariableIds(item, output)
    return output
  }

  if (typeof value === "object") {
    if (typeof value.id === "string" && value.id.startsWith("VariableID:")) {
      output.add(value.id)
    }

    for (const child of Object.values(value)) {
      collectVariableIds(child, output)
    }
  }

  return output
}

export function collectBoundVariableIdsForNode(rawSource, nodeId) {
  const variableIds = new Set()

  function walk(node, insideTarget = false) {
    if (!node || typeof node !== "object") return

    const isInsideTarget = insideTarget || node.id === nodeId

    if (isInsideTarget && node.boundVariables) {
      collectVariableIds(node.boundVariables, variableIds)
    }

    for (const child of node.children ?? []) {
      walk(child, isInsideTarget)
    }
  }

  walk(rawSource.document ?? rawSource)
  return variableIds
}

export function readNodeBounds(node) {
  const bounds = node?.absoluteBoundingBox ?? node?.bounds
  if (!bounds) return undefined

  return {
    width: bounds.width ?? bounds.w,
    height: bounds.height ?? bounds.h,
  }
}

export function resolveInside(root, relativePath) {
  const resolvedRoot = resolve(root)
  const resolvedPath = resolve(resolvedRoot, relativePath)
  const rootPrefix = resolvedRoot.endsWith(sep) ? resolvedRoot : `${resolvedRoot}${sep}`
  if (resolvedPath !== resolvedRoot && !resolvedPath.startsWith(rootPrefix)) {
    throw new Error(`Refusing to write outside root: ${relativePath}`)
  }
  return resolvedPath
}

export function resolveBaselinePath(repoRoot, contract, caseEntry) {
  const baselineRoot =
    contract.baselineRoot ??
    `${defaultReflectionFamiliesRoot}/${contract.family ?? caseEntry.family}/baselines`
  return resolve(repoRoot, baselineRoot, caseEntry.baseline)
}

export function loadReflectionContracts(
  repoRoot = defaultRepoRoot,
  familiesRoot = defaultReflectionFamiliesRoot,
) {
  const root = absolute(repoRoot, familiesRoot)
  if (!existsSync(root)) return []

  return readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const path = `${familiesRoot}/${entry.name}/reflection-contract.json`
      if (!pathExists(repoRoot, path)) return undefined
      return {
        family: entry.name,
        path,
        contract: readJson(repoRoot, path),
      }
    })
    .filter(Boolean)
    .sort((left, right) => left.family.localeCompare(right.family))
}

export function loadReflectionContract(repoRoot, family) {
  const path = `${defaultReflectionFamiliesRoot}/${family}/reflection-contract.json`
  if (!pathExists(repoRoot, path)) return undefined
  return {
    family,
    path,
    contract: readJson(repoRoot, path),
  }
}

export function findContractCase(contract, caseId, mode) {
  return (contract.cases ?? []).find((entry) => entry.caseId === caseId && entry.mode === mode)
}

export function resolveSourceFrameId(repoRoot, contract, caseEntry) {
  if (typeof caseEntry.source?.sourceFrameId === "string") return caseEntry.source.sourceFrameId

  const family = contract.family ?? caseEntry.family
  const framePrepPath = `${defaultReflectionFamiliesRoot}/${family}/frame-prep.json`
  if (pathExists(repoRoot, framePrepPath)) {
    const framePrep = readJson(repoRoot, framePrepPath)
    const prepCase = (framePrep.cases ?? []).find((entry) => entry.caseId === caseEntry.caseId)
    const frameId = prepCase?.modes?.[caseEntry.mode]?.sourceFrameId
    if (typeof frameId === "string") return frameId
  }

  if (pathExists(repoRoot, defaultSourceRegistryPath)) {
    const registry = readJson(repoRoot, defaultSourceRegistryPath)
    const frameId = registry.families?.[family]?.[caseEntry.mode]?.sourceFrameId
    if (typeof frameId === "string") return frameId
  }

  return undefined
}

export function sourceNodeIdsForCase(caseEntry) {
  return [
    caseEntry.source?.componentNodeId,
    ...(Array.isArray(caseEntry.source?.componentNodeIds) ? caseEntry.source.componentNodeIds : []),
  ].filter((id, index, ids) => typeof id === "string" && ids.indexOf(id) === index)
}

export function computeSourceFingerprint(rawSource, nodeIds) {
  const nodes = nodeIds.map((nodeId) => ({
    nodeId,
    node: findNodeById(rawSource, nodeId) ?? null,
  }))

  return sha256Json(nodes)
}

export function computeVariablesFingerprint(variableSource, requiredBoundTokens = []) {
  const variableMap = loadVariableMap(variableSource)
  const requiredTokens = requiredBoundTokens.map(normalizeTokenName).sort()
  const variables = requiredTokens.map((token) => ({
    token,
    matches: (variableMap.byNormalizedName.get(token) ?? []).map((entry) => ({
      id: entry.id,
      name: entry.name,
      raw: entry.raw,
    })),
  }))

  return sha256Json({
    requiredTokens,
    variables,
  })
}

export function validateVariableModePolicy(policy) {
  if (policy === undefined) return undefined
  if (
    !policy ||
    typeof policy !== "object" ||
    Array.isArray(policy) ||
    Object.keys(policy).sort().join(",") !== "collectionModes,descendants,schemaVersion" ||
    policy.schemaVersion !== 1 ||
    policy.descendants !== "override-declared-collections" ||
    !policy.collectionModes ||
    typeof policy.collectionModes !== "object" ||
    Array.isArray(policy.collectionModes)
  )
    throw new Error("Invalid variableModePolicy/v1")
  const ids = Object.keys(policy.collectionModes).sort()
  if (ids.length === 0 || ids.length > 16)
    throw new Error("variableModePolicy needs 1–16 exact collections")
  const modes = {}
  for (let index = 0; index < ids.length; index += 1) {
    const id = ids[index]
    if (
      !/^VariableCollectionId:\d+:\d+$/.test(id) ||
      typeof policy.collectionModes[id] !== "string" ||
      !/^\d+:\d+$/.test(policy.collectionModes[id])
    )
      throw new Error("Invalid explicit collection/mode identity")
    modes[id] = policy.collectionModes[id]
  }
  return { schemaVersion: 1, descendants: "override-declared-collections", collectionModes: modes }
}
function caseVariableModePolicy(caseEntry) {
  const policy = validateVariableModePolicy(caseEntry.prep?.variableModePolicy)
  if (!policy) return undefined
  const expected = caseEntry.collectionModes
  if (!expected || typeof expected !== "object" || Array.isArray(expected))
    throw new Error("Explicit mode policy requires independent case.collectionModes")
  for (const [collectionId, modeId] of Object.entries(policy.collectionModes)) {
    if (expected[collectionId] !== modeId)
      throw new Error(`Explicit mode policy conflicts with case collectionModes: ${collectionId}`)
  }
  return policy
}

function acknowledgedModeCapture(caseEntry, captureMetadata) {
  const policy = caseVariableModePolicy(caseEntry)
  if (!policy) return undefined
  const acknowledged = validateVariableModePolicy(captureMetadata?.variableModePolicy)
  if (
    stableStringify(acknowledged) !== stableStringify(policy) ||
    captureMetadata?.figmaNodeId !== caseEntry.figmaNodeId ||
    typeof captureMetadata?.requestHash !== "string" ||
    !/^h[0-9a-f]{1,8}$/.test(captureMetadata.requestHash)
  )
    throw new Error("Explicit mode capture acknowledgment does not match case/policy")
  return { policy, policySha256: sha256Json(policy), requestHash: captureMetadata.requestHash }
}

export function computeCaseFingerprint({ contract, caseEntry, sourceFrameId }) {
  const policy = caseVariableModePolicy(caseEntry)
  return sha256Json({
    family: contract.family,
    figmaFileKey: contract.figmaFileKey,
    caseId: caseEntry.caseId,
    mode: caseEntry.mode,
    figmaFrameName: caseEntry.figmaFrameName,
    baseline: caseEntry.baseline,
    sourceFrameId: sourceFrameId ?? null,
    sourceNodeId: caseEntry.source?.componentNodeId ?? null,
    sourceNodeIds: sourceNodeIdsForCase(caseEntry),
    viewport: caseEntry.viewport,
    viewportSize: caseEntry.viewportSize,
    framing: caseEntry.framing ?? null,
    exportScale: caseEntry.exportScale ?? 1,
    ...(policy ? { variableModePolicy: policy } : {}),
  })
}

export function buildBaselineReceipt({
  repoRoot = defaultRepoRoot,
  contract,
  caseEntry,
  rawSource,
  variableSource,
  pngPath,
  origin,
  sourceFrameId,
  createdAt,
  captureMetadata = /** @type {{variableModePolicy?: unknown, figmaNodeId?: string, requestHash?: string} | undefined} */ (
    undefined
  ),
}) {
  if (!baselineReceiptOrigins.has(origin)) {
    throw new Error(`Unknown baseline receipt origin: ${origin}`)
  }

  const modeCapture = acknowledgedModeCapture(caseEntry, captureMetadata)
  const png = readBaselineInfo(pngPath)
  const expectedSize = caseEntry.viewportSize
  if (png.width !== expectedSize?.width || png.height !== expectedSize?.height) {
    throw new Error(
      `${caseEntry.caseId} ${caseEntry.mode} baseline is ${png.width}x${png.height}, expected ${expectedSize?.width}x${expectedSize?.height}`,
    )
  }

  const resolvedSourceFrameId = sourceFrameId ?? resolveSourceFrameId(repoRoot, contract, caseEntry)
  const sourceNodeIds = sourceNodeIdsForCase(caseEntry)
  const sourceNodeId = caseEntry.source?.componentNodeId ?? null
  const sourceFingerprint = computeSourceFingerprint(rawSource, sourceNodeIds)
  const variablesFingerprint = computeVariablesFingerprint(
    variableSource,
    caseEntry.source?.requiredBoundTokens ?? [],
  )
  const caseFingerprint = computeCaseFingerprint({
    contract,
    caseEntry,
    sourceFrameId: resolvedSourceFrameId,
  })

  return {
    schemaVersion: png.format === "webp" ? 2 : baselineReceiptSchemaVersion,
    family: contract.family ?? caseEntry.family,
    caseId: caseEntry.caseId,
    mode: caseEntry.mode,
    figmaFileKey: contract.figmaFileKey ?? caseEntry.figmaFileKey,
    figmaFrameName: caseEntry.figmaFrameName,
    generatedFrameId: caseEntry.figmaNodeId ?? null,
    sourceFrameId: resolvedSourceFrameId ?? null,
    sourceNodeId,
    sourceNodeIds,
    baseline: caseEntry.baseline,
    viewport: caseEntry.viewport,
    viewportSize: caseEntry.viewportSize,
    framing: caseEntry.framing ?? null,
    exportScale: caseEntry.exportScale ?? 1,
    ...(png.format === "webp"
      ? {
          imageFormat: "webp",
          imageSha256: png.sha256,
          imageDimensions: { width: png.width, height: png.height },
          imageByteLength: png.byteLength,
        }
      : {
          pngSha256: png.sha256,
          pngDimensions: { width: png.width, height: png.height },
          pngByteLength: png.byteLength,
        }),
    sourceFingerprint,
    variablesFingerprint,
    caseFingerprint,
    ...(modeCapture
      ? {
          variableModePolicy: modeCapture.policy,
          variableModePolicySha256: modeCapture.policySha256,
          captureRequestHash: modeCapture.requestHash,
        }
      : {}),
    origin,
    createdAt: createdAt ?? new Date().toISOString(),
  }
}

export function compareReceipt(receipt, expectedReceipt) {
  const issues = []

  if (!receipt || typeof receipt !== "object") {
    return ["receipt is not a JSON object"]
  }

  if (!baselineReceiptOrigins.has(receipt.origin)) {
    issues.push(`origin ${receipt.origin ?? "undefined"} is not recognized`)
  }

  const exactFields = [
    "schemaVersion",
    "family",
    "caseId",
    "mode",
    "figmaFileKey",
    "figmaFrameName",
    "sourceFrameId",
    "sourceNodeId",
    "baseline",
    "viewport",
    "exportScale",
    "pngSha256",
    "pngByteLength",
    "imageFormat",
    "imageSha256",
    "imageByteLength",
    "sourceFingerprint",
    "variablesFingerprint",
    "caseFingerprint",
    "variableModePolicy",
    "variableModePolicySha256",
    "captureRequestHash",
  ]

  for (const field of exactFields) {
    if (stableStringify(receipt[field]) !== stableStringify(expectedReceipt[field])) {
      issues.push(`${field} mismatch`)
    }
  }

  for (const field of [
    "sourceNodeIds",
    "viewportSize",
    "framing",
    "pngDimensions",
    "imageDimensions",
  ]) {
    if (stableStringify(receipt[field]) !== stableStringify(expectedReceipt[field])) {
      issues.push(`${field} mismatch`)
    }
  }

  return issues
}

export async function writeBaselineReceipt({
  repoRoot = defaultRepoRoot,
  contract,
  caseEntry,
  context,
  pngPath,
  origin,
  sourceFrameId,
  captureMetadata = /** @type {{variableModePolicy?: unknown, figmaNodeId?: string, requestHash?: string} | undefined} */ (
    undefined
  ),
}) {
  const expected = buildBaselineReceipt({
    repoRoot,
    contract,
    caseEntry,
    rawSource: context.rawSource,
    variableSource: context.variableSource,
    pngPath,
    origin,
    sourceFrameId,
    captureMetadata,
  })
  const receiptPath = receiptPathForBaselinePath(pngPath)

  let existing
  let existingText
  if (await pathExistsAbsolute(receiptPath)) {
    existingText = await readFile(receiptPath, "utf8")
    existing = JSON.parse(existingText)
  }

  const receipt =
    existing && compareReceipt(existing, expected).length === 0
      ? { ...expected, origin: existing.origin, createdAt: existing.createdAt }
      : expected

  const formatted = formatReceiptJson(receipt)
  const changed = existingText !== formatted
  if (changed) {
    await mkdir(dirname(receiptPath), { recursive: true })
    await writeFile(receiptPath, formatted)
  }

  return {
    receipt,
    receiptPath,
    changed,
  }
}

export function validateBaselineReceipt({
  repoRoot = defaultRepoRoot,
  contract,
  caseEntry,
  context,
  pngPath,
  requireReceipt = false,
}) {
  const receiptPath = receiptPathForBaselinePath(pngPath)

  if (!existsSync(receiptPath)) {
    return {
      status: requireReceipt ? "fail" : "warn",
      receiptPath,
      details: [`missing: ${receiptPath}`],
    }
  }

  let receipt
  try {
    receipt = readJsonFile(receiptPath)
  } catch (error) {
    return {
      status: "fail",
      receiptPath,
      details: [`invalid JSON: ${error.message}`],
    }
  }

  let expected
  try {
    expected = buildBaselineReceipt({
      repoRoot,
      contract,
      caseEntry,
      rawSource: context.rawSource,
      variableSource: context.variableSource,
      pngPath,
      origin: receipt.origin,
      createdAt: receipt.createdAt,
      captureMetadata: {
        variableModePolicy: receipt.variableModePolicy,
        requestHash: receipt.captureRequestHash,
        figmaNodeId: receipt.generatedFrameId,
      },
    })
  } catch (error) {
    return {
      status: "fail",
      receiptPath,
      details: [`could not compute expected receipt: ${error.message}`],
    }
  }

  const issues = compareReceipt(receipt, expected)
  if (issues.length > 0) {
    return {
      status: "fail",
      receiptPath,
      details: issues,
    }
  }

  return {
    status: "pass",
    receiptPath,
    details: [
      `${receiptPath}: ${receiptImageIdentity(receipt).dimensions.width}x${receiptImageIdentity(receipt).dimensions.height}`,
      `imageSha256: ${receiptImageIdentity(receipt).sha256.slice(0, 12)}`,
      `sourceFingerprint: ${receipt.sourceFingerprint.slice(0, 12)}`,
      `variablesFingerprint: ${receipt.variablesFingerprint.slice(0, 12)}`,
    ],
  }
}
