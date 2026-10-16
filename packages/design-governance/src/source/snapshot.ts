import { createHash } from "node:crypto"
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs"
import { join } from "node:path"

import type {
  FigmaCollection,
  FigmaNode,
  FigmaVariable,
  LegacyContract,
  RawFigmaSource,
  SourceIdentity,
} from "./types.ts"
export type { FigmaNode } from "./types.ts"
export type SourceSnapshot = {
  schemaVersion: 1
  family: string
  fileKey: string
  capture: { version: string; lastModified: string; provenance: string }
  hashes: { raw: string; manifest: string; variables: string }
  nodes: Record<string, FigmaNode>
  inheritedModes: Record<string, Record<string, string>>
  variables: FigmaVariable[]
  collections: FigmaCollection[]
  components: Record<string, unknown>
  styles: Record<string, unknown>
  missingDependencies: string[]
  missingOptionalFrames: string[]
  variantInventory: { id: string; name: string }[]
}
export const familyRoot = "packages/design-governance/reflection-families"
export const hash = (value: string | Buffer): string =>
  createHash("sha256").update(value).digest("hex")
export const readJson = <T = unknown>(path: string): T =>
  JSON.parse(readFileSync(path, "utf8")) as T

export function configuredSourceIdentity(
  repoRoot: string,
): Omit<SourceIdentity, "manifest" | "variables"> {
  const config = readJson<{
    defaultTarget: string
    targets: Record<string, { figmaFile: string; liveDir: string }>
  }>(join(repoRoot, ".pi/figma-sync.json"))
  const target = config.targets[config.defaultTarget]
  if (!target) throw new Error("Missing configured Figma target")
  const fileKey = /\/design\/([^/]+)/.exec(target.figmaFile)?.[1]
  if (!fileKey) throw new Error("Configured Figma URL has no file key")
  const live = join(repoRoot, target.liveDir)
  return {
    fileKey,
    live,
    manifestPath: join(live, "manifest.json"),
    variablesPath: join(live, "tokens/variables.json"),
    rawPath: join(live, "_raw", `${fileKey}_full.json`),
  }
}

export function sourceIdentity(repoRoot: string): SourceIdentity {
  const target = configuredSourceIdentity(repoRoot)
  const manifest = readJson<SourceIdentity["manifest"]>(target.manifestPath)
  const variables = readJson<SourceIdentity["variables"]>(target.variablesPath)
  if (manifest.fileKey !== target.fileKey || variables.fileKey !== target.fileKey)
    throw new Error("Configured Figma file, manifest and variables identity mismatch")
  return { ...target, manifest, variables }
}

export function extractSnapshot(
  raw: RawFigmaSource,
  identity: ReturnType<typeof sourceIdentity>,
  family: string,
  nodeIds: string[],
  hashes: SourceSnapshot["hashes"],
  requiredTokens: string[] = [],
  optionalFrameIds: string[] = [],
): SourceSnapshot {
  if (
    raw.version !== identity.manifest.version ||
    raw.lastModified !== identity.manifest.lastModified
  )
    throw new Error("Raw capture version/date differs from configured manifest")
  const index = new Map<string, FigmaNode>()
  const modes = new Map<string, Record<string, string>>()
  function visit(node: FigmaNode, inherited: Record<string, string>) {
    if (!node?.id || !node.type) return
    const effective = { ...inherited, ...node.explicitVariableModes }
    index.set(node.id, node)
    modes.set(node.id, effective)
    for (const child of node.children ?? []) visit(child, effective)
  }
  visit(raw.document, {})
  const nodes: Record<string, FigmaNode> = {}
  const inheritedModes: SourceSnapshot["inheritedModes"] = {}
  const missingDependencies = new Set<string>()
  const components: Record<string, unknown> = {}
  const styles: Record<string, unknown> = {}
  function capture(id: string) {
    if (nodes[id]) return
    const node = index.get(id)
    if (!node) {
      missingDependencies.add(`node:${id}`)
      return
    }
    nodes[id] = node
    inheritedModes[id] = modes.get(id) ?? {}
    function dependencies(child: FigmaNode) {
      if (child.componentId) {
        if (raw.components?.[child.componentId])
          components[child.componentId] = raw.components[child.componentId]
        capture(child.componentId)
      }
      for (const styleId of Object.values(child.styles ?? {})) {
        if (raw.styles?.[String(styleId)]) styles[String(styleId)] = raw.styles[String(styleId)]
        else missingDependencies.add(`style:${styleId}`)
      }
      for (const nested of child.children ?? []) dependencies(nested)
    }
    dependencies(node)
  }
  for (const id of nodeIds) capture(id)
  const variableIndex = new Map<string, FigmaVariable>(
    identity.variables.variables.map((v) => [v.id, v]),
  )
  const selectedVariables = new Map<string, FigmaVariable>()
  function references(input: unknown): void {
    const value = input as Record<string, unknown>
    if (!value || typeof value !== "object") return
    if (value.type === "VARIABLE_ALIAS" && typeof value.id === "string") {
      if (selectedVariables.has(value.id)) return
      const variable = variableIndex.get(value.id)
      if (!variable) {
        missingDependencies.add(`variable:${value.id}`)
        return
      }
      selectedVariables.set(value.id, variable)
      references(variable.rawValuesByMode ?? variable.valuesByModeId)
    }
    for (const child of Object.values(value)) references(child)
  }
  references(nodes)
  const normalize = (name: string): string =>
    name
      .replace(/\\/g, "/")
      .replace(/\s*\/\s*/g, "/")
      .trim()
      .toLowerCase()
  const requiredNames = new Set(requiredTokens.map(normalize))
  for (const variable of identity.variables.variables) {
    if (typeof variable.name === "string" && requiredNames.has(normalize(variable.name))) {
      selectedVariables.set(variable.id, variable)
      references(variable.rawValuesByMode ?? variable.valuesByModeId)
    }
  }
  const missingOptionalFrames = optionalFrameIds.filter((id) =>
    missingDependencies.has(`node:${id}`),
  )
  for (const id of missingOptionalFrames) missingDependencies.delete(`node:${id}`)
  const variantInventory = new Map<string, { id: string; name: string }>()
  for (const candidate of index.values()) {
    if (
      candidate.type === "COMPONENT_SET" &&
      candidate.children?.some((child) => nodes[child.id])
    ) {
      for (const variant of candidate.children)
        variantInventory.set(variant.id, { id: variant.id, name: variant.name })
    }
  }
  const selectedCollections = new Set(
    [...selectedVariables.values()].map((v) => v.variableCollectionId ?? v.collectionId),
  )
  // Preserve every mode of each selected variable and its transitive aliases.
  return {
    schemaVersion: 1,
    family,
    fileKey: identity.fileKey,
    capture: {
      version: raw.version,
      lastModified: raw.lastModified,
      provenance: "inherited-pinned-offline-capture; not a new Figma capture or approval",
    },
    hashes,
    nodes,
    inheritedModes,
    variables: identity.variables.variables.filter((variable) =>
      selectedVariables.has(variable.id),
    ),
    collections: identity.variables.collections.filter((c) => selectedCollections.has(c.id)),
    components,
    styles,
    missingDependencies: [...missingDependencies].sort(),
    missingOptionalFrames,
    variantInventory: [...variantInventory.values()],
  }
}

export function importCompactSources(repoRoot: string): string[] {
  const identity = sourceIdentity(repoRoot)
  if (!existsSync(identity.rawPath))
    throw new Error(`Missing exact configured raw source ${identity.rawPath}`)
  const rawBytes = readFileSync(identity.rawPath)
  const hashes = {
    raw: hash(rawBytes),
    manifest: hash(readFileSync(identity.manifestPath)),
    variables: hash(readFileSync(identity.variablesPath)),
  }
  const raw = JSON.parse(rawBytes.toString("utf8")) as RawFigmaSource
  const output: string[] = []
  for (const family of readdirSync(join(repoRoot, familyRoot))) {
    const contractPath = join(repoRoot, familyRoot, family, "reflection-contract.json")
    if (!existsSync(contractPath)) continue
    const contract = readJson<LegacyContract>(contractPath)
    if (contract.figmaFileKey !== identity.fileKey)
      throw new Error(`Family ${family} uses another Figma file`)
    const ids = [
      ...new Set<string>(
        contract.cases.flatMap((item) =>
          [
            item.source?.componentNodeId,
            ...(item.source?.componentNodeIds ?? []),
            item.figmaNodeId,
          ].filter((id: string) => id && !id.startsWith("TODO_")),
        ),
      ),
    ]
    const snapshot = extractSnapshot(
      raw,
      identity,
      family,
      ids,
      hashes,
      contract.cases.flatMap((item) => item.source?.requiredBoundTokens ?? []),
      contract.cases.map((item) => item.figmaNodeId).filter((id) => id && !id.startsWith("TODO_")),
    )
    const directory = join(repoRoot, familyRoot, family, "source")
    mkdirSync(directory, { recursive: true })
    const bytes = `${JSON.stringify(snapshot, null, 2)}\n`
    const manifestBytes = `${JSON.stringify({ schemaVersion: 1, family, fileKey: identity.fileKey, snapshotSha256: hash(bytes), hashes, capture: snapshot.capture }, null, 2)}\n`
    const snapshotPath = join(directory, "snapshot.json")
    const manifestPath = join(directory, "manifest.json")
    if (existsSync(snapshotPath) || existsSync(manifestPath)) {
      if (
        !existsSync(snapshotPath) ||
        !existsSync(manifestPath) ||
        readFileSync(snapshotPath, "utf8") !== bytes ||
        readFileSync(manifestPath, "utf8") !== manifestBytes
      )
        throw new Error(
          `Active compact source differs for ${family}; stage and exact owner approval are required before promotion`,
        )
    } else {
      writeFileSync(snapshotPath, bytes)
      writeFileSync(manifestPath, manifestBytes)
    }
    output.push(family)
  }
  return output
}

export function loadSnapshot(repoRoot: string, family: string): SourceSnapshot {
  const identity = configuredSourceIdentity(repoRoot)
  const directory = join(repoRoot, familyRoot, family, "source")
  const bytes = readFileSync(join(directory, "snapshot.json"))
  const manifest = readJson(join(directory, "manifest.json"))
  const snapshot = JSON.parse(bytes.toString("utf8")) as SourceSnapshot
  validateSnapshotManifest(manifest, snapshot, bytes)
  if (snapshot.family !== family || snapshot.fileKey !== identity.fileKey)
    throw new Error(`Invalid compact source identity for ${family}`)
  const contract = readJson<LegacyContract>(
    join(repoRoot, familyRoot, family, "reflection-contract.json"),
  )
  if (contract.figmaFileKey !== identity.fileKey)
    throw new Error(`Configured source and contract identity mismatch for ${family}`)
  // Routine offline checks use committed proof. Available local exports remain strict freshness inputs.
  if (existsSync(identity.manifestPath)) {
    const localManifest = readJson<SourceIdentity["manifest"]>(identity.manifestPath)
    if (
      localManifest.fileKey !== identity.fileKey ||
      snapshot.capture.version !== localManifest.version ||
      snapshot.capture.lastModified !== localManifest.lastModified ||
      snapshot.hashes.manifest !== hash(readFileSync(identity.manifestPath))
    )
      throw new Error(`Compact capture identity stale for ${family}; local manifest changed`)
  }
  if (existsSync(identity.variablesPath)) {
    const localVariables = readJson<SourceIdentity["variables"]>(identity.variablesPath)
    if (
      localVariables.fileKey !== identity.fileKey ||
      snapshot.hashes.variables !== hash(readFileSync(identity.variablesPath))
    )
      throw new Error(`Compact source stale for ${family}; local variables changed`)
  }
  return snapshot
}

export function validateSnapshotManifest(
  manifest: unknown,
  snapshot: SourceSnapshot,
  bytes: Buffer | string,
): void {
  validateSnapshot(snapshot)
  const object = (value: unknown, keys: string[], label: string): Record<string, unknown> => {
    if (!value || typeof value !== "object" || Array.isArray(value))
      throw new Error(`Malformed compact ${label}`)
    const record = value as Record<string, unknown>
    if (
      Object.keys(record).length !== keys.length ||
      Object.keys(record).some((key) => !keys.includes(key))
    )
      throw new Error(`Unknown or missing compact ${label} field`)
    return record
  }
  const record = object(
    manifest,
    ["schemaVersion", "family", "fileKey", "snapshotSha256", "hashes", "capture"],
    "manifest",
  )
  if (
    record.schemaVersion !== 1 ||
    record.family !== snapshot.family ||
    record.fileKey !== snapshot.fileKey
  )
    throw new Error("Compact manifest identity mismatch")
  if (
    typeof record.snapshotSha256 !== "string" ||
    !/^[a-f0-9]{64}$/.test(record.snapshotSha256) ||
    record.snapshotSha256 !== hash(bytes)
  )
    throw new Error("Compact manifest snapshot hash mismatch")
  const hashes = object(record.hashes, ["raw", "manifest", "variables"], "manifest hashes")
  for (const key of ["raw", "manifest", "variables"] as const)
    if (
      typeof hashes[key] !== "string" ||
      !/^[a-f0-9]{64}$/.test(hashes[key]) ||
      hashes[key] !== snapshot.hashes[key]
    )
      throw new Error(`Compact manifest original ${key} hash mismatch`)
  const capture = object(
    record.capture,
    ["version", "lastModified", "provenance"],
    "manifest capture",
  )
  for (const key of ["version", "lastModified", "provenance"] as const)
    if (typeof capture[key] !== "string" || !capture[key] || capture[key] !== snapshot.capture[key])
      throw new Error(`Compact manifest capture ${key} mismatch`)
  if (JSON.stringify(JSON.parse(bytes.toString())) !== JSON.stringify(snapshot))
    throw new Error("Compact manifest payload and snapshot disagree")
}

export function validateSnapshot(snapshot: SourceSnapshot): void {
  const allowed = [
    "schemaVersion",
    "family",
    "fileKey",
    "capture",
    "hashes",
    "nodes",
    "inheritedModes",
    "variables",
    "collections",
    "components",
    "styles",
    "missingDependencies",
    "missingOptionalFrames",
    "variantInventory",
  ]
  if (
    !snapshot ||
    typeof snapshot !== "object" ||
    Array.isArray(snapshot) ||
    Object.keys(snapshot).length !== allowed.length ||
    Object.keys(snapshot).some((key) => !allowed.includes(key))
  )
    throw new Error("Unknown source snapshot field")
  if (
    snapshot.schemaVersion !== 1 ||
    typeof snapshot.fileKey !== "string" ||
    !snapshot.fileKey ||
    typeof snapshot.family !== "string" ||
    !snapshot.family ||
    !snapshot.nodes ||
    typeof snapshot.nodes !== "object" ||
    Array.isArray(snapshot.nodes) ||
    !snapshot.inheritedModes ||
    typeof snapshot.inheritedModes !== "object" ||
    Array.isArray(snapshot.inheritedModes) ||
    !snapshot.components ||
    typeof snapshot.components !== "object" ||
    Array.isArray(snapshot.components) ||
    !snapshot.styles ||
    typeof snapshot.styles !== "object" ||
    Array.isArray(snapshot.styles) ||
    !Array.isArray(snapshot.variables) ||
    !Array.isArray(snapshot.collections) ||
    !Array.isArray(snapshot.missingDependencies) ||
    snapshot.missingDependencies.some((item) => typeof item !== "string")
  )
    throw new Error("Malformed source snapshot")
  if (
    !snapshot.capture ||
    typeof snapshot.capture !== "object" ||
    Array.isArray(snapshot.capture) ||
    Object.keys(snapshot.capture).length !== 3 ||
    Object.keys(snapshot.capture).some(
      (key) => !["version", "lastModified", "provenance"].includes(key),
    ) ||
    Object.values(snapshot.capture).some((value) => typeof value !== "string" || !value)
  )
    throw new Error("Malformed snapshot capture provenance")
  if (
    !Array.isArray(snapshot.missingOptionalFrames) ||
    snapshot.missingOptionalFrames.some((id) => typeof id !== "string") ||
    !Array.isArray(snapshot.variantInventory) ||
    snapshot.variantInventory.some(
      (variant) => !variant || typeof variant.id !== "string" || typeof variant.name !== "string",
    )
  )
    throw new Error("Malformed snapshot source inventory")
  for (const modes of Object.values(snapshot.inheritedModes))
    if (
      !modes ||
      typeof modes !== "object" ||
      Array.isArray(modes) ||
      Object.values(modes).some((mode) => typeof mode !== "string")
    )
      throw new Error("Malformed inherited collection modes")
  if (
    new Set(snapshot.variables.map((variable) => variable.id)).size !== snapshot.variables.length ||
    new Set(snapshot.collections.map((collection) => collection.id)).size !==
      snapshot.collections.length
  )
    throw new Error("Duplicate source variable/collection identity")
  for (const digest of Object.values(snapshot.hashes ?? {}))
    if (typeof digest !== "string" || !/^[a-f0-9]{64}$/.test(digest))
      throw new Error("Malformed source snapshot hash")
  if (
    Object.keys(snapshot.hashes ?? {})
      .sort()
      .join() !== "manifest,raw,variables"
  )
    throw new Error("Missing source snapshot hashes")
  function validateNode(node: FigmaNode): void {
    if (
      !node ||
      typeof node !== "object" ||
      Array.isArray(node) ||
      typeof node.id !== "string" ||
      !node.id ||
      typeof node.type !== "string" ||
      !node.type ||
      typeof node.name !== "string" ||
      !node.name ||
      (node.children !== undefined && !Array.isArray(node.children))
    )
      throw new Error("Malformed detailed source node")
    for (const child of node.children ?? []) validateNode(child)
  }
  for (const [id, node] of Object.entries(snapshot.nodes)) {
    validateNode(node)
    if (node.id !== id || !snapshot.inheritedModes[id])
      throw new Error(`Malformed detailed source node identity/modes ${id}`)
  }
  for (const variable of snapshot.variables)
    if (
      !variable.id ||
      !(variable.collectionId ?? variable.variableCollectionId) ||
      !(variable.rawValuesByMode ?? variable.valuesByModeId)
    )
      throw new Error("Malformed snapshot variable")
  for (const collection of snapshot.collections)
    if (!collection.id || !Array.isArray(collection.modes) || !collection.modes.length)
      throw new Error("Malformed snapshot collection")
}
