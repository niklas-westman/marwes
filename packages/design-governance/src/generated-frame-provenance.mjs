import { existsSync } from "node:fs"
import { mkdir, readFile, writeFile } from "node:fs/promises"
import { dirname, resolve } from "node:path"
import {
  computeCaseFingerprint,
  computeSourceFingerprint,
  findContractCase,
  formatReceiptJson,
  loadReflectionContract,
  readJsonFile,
  resolveSourceFrameId,
  sha256Json,
  sourceNodeIdsForCase,
  stableStringify,
} from "./baseline-receipts.mjs"

export const generatedFrameProvenanceSchemaVersion = 1
const figmaNodeIdPattern = /^\d+:\d+$/

export function generatedFrameProvenancePath(repoRoot, family) {
  return resolve(
    repoRoot,
    "packages/design-governance/reflection-families",
    family,
    "generated-frames.json",
  )
}

export function computePrepFingerprint(caseEntry) {
  return sha256Json({
    caseId: caseEntry.caseId,
    mode: caseEntry.mode,
    figmaFrameName: caseEntry.figmaFrameName,
    viewport: caseEntry.viewport,
    viewportSize: caseEntry.viewportSize,
    framing: caseEntry.framing ?? null,
    prep: caseEntry.prep ?? null,
  })
}

export function buildGeneratedFrameProvenanceEntry({
  repoRoot,
  contract,
  caseEntry,
  context,
  bridgeFrame,
  createdAt,
}) {
  const sourceFrameId = resolveSourceFrameId(repoRoot, contract, caseEntry)
  const sourceNodeIds = sourceNodeIdsForCase(caseEntry)

  return {
    caseId: caseEntry.caseId,
    mode: caseEntry.mode,
    figmaFrameId: bridgeFrame.figmaNodeId ?? caseEntry.figmaNodeId ?? null,
    figmaFrameName: caseEntry.figmaFrameName,
    sourceFrameId: sourceFrameId ?? null,
    sourceNodeId: caseEntry.source?.componentNodeId ?? null,
    sourceNodeIds,
    viewport: caseEntry.viewport,
    viewportSize: caseEntry.viewportSize,
    framing: caseEntry.framing ?? null,
    exportScale: caseEntry.exportScale ?? 1,
    requestHash: bridgeFrame.requestHash ?? null,
    sourceFingerprint: computeSourceFingerprint(context.rawSource, sourceNodeIds),
    pluginSourceFingerprint: bridgeFrame.sourceFingerprint ?? null,
    caseFingerprint: computeCaseFingerprint({ contract, caseEntry, sourceFrameId }),
    prepFingerprint: computePrepFingerprint(caseEntry),
    destinationPageId: bridgeFrame.destinationPageId ?? null,
    destinationPageName: bridgeFrame.destinationPageName ?? null,
    position: bridgeFrame.position ?? null,
    placementAnchor: bridgeFrame.placementAnchor ?? null,
    bridgeStatus: bridgeFrame.status ?? null,
    bridgeReason: bridgeFrame.reason ?? null,
    generatedAt: createdAt ?? new Date().toISOString(),
    approval: "unreviewed",
  }
}

export function buildGeneratedFrameProvenanceFile({ contract, family, frames }) {
  return {
    schemaVersion: generatedFrameProvenanceSchemaVersion,
    family,
    figmaFileKey: contract.figmaFileKey,
    generatedBy: {
      tool: "marwes-reflection-frame-prep",
      artifact: "generated-frames.json",
    },
    frames,
  }
}

export function readGeneratedFrameProvenance(repoRoot, family) {
  const path = generatedFrameProvenancePath(repoRoot, family)
  if (!existsSync(path)) return undefined
  return readJsonFile(path)
}

export function findGeneratedFrameProvenanceEntry(provenance, caseId, mode) {
  return (provenance?.frames ?? []).find((entry) => entry.caseId === caseId && entry.mode === mode)
}

export async function writeGeneratedFrameProvenance({ repoRoot, family, context, entries }) {
  const contractEntry = loadReflectionContract(repoRoot, family)
  if (!contractEntry) throw new Error(`Could not find reflection contract for ${family}`)

  const path = generatedFrameProvenancePath(repoRoot, family)
  const existing = existsSync(path) ? readJsonFile(path) : undefined
  const existingByKey = new Map(
    (existing?.frames ?? []).map((entry) => [`${entry.caseId}:${entry.mode}`, entry]),
  )

  const nextByKey = new Map(
    (existing?.frames ?? []).map((entry) => [`${entry.caseId}:${entry.mode}`, entry]),
  )
  const createdAt = new Date().toISOString()

  for (const bridgeFrame of entries) {
    const caseEntry = findContractCase(contractEntry.contract, bridgeFrame.caseId, bridgeFrame.mode)
    if (!caseEntry) {
      throw new Error(`Could not find contract case ${bridgeFrame.caseId} ${bridgeFrame.mode}`)
    }

    const next = buildGeneratedFrameProvenanceEntry({
      repoRoot,
      contract: contractEntry.contract,
      caseEntry,
      context,
      bridgeFrame,
      createdAt,
    })
    const key = `${next.caseId}:${next.mode}`
    const previous = existingByKey.get(key)

    if (
      previous &&
      previous.figmaFrameId === next.figmaFrameId &&
      previous.requestHash === next.requestHash &&
      previous.sourceFingerprint === next.sourceFingerprint &&
      previous.caseFingerprint === next.caseFingerprint &&
      previous.prepFingerprint === next.prepFingerprint
    ) {
      next.generatedAt = previous.generatedAt
      next.approval = previous.approval ?? next.approval
    }

    nextByKey.set(key, next)
  }

  const file = buildGeneratedFrameProvenanceFile({
    contract: contractEntry.contract,
    family,
    frames: [...nextByKey.values()].sort((left, right) =>
      `${left.caseId}:${left.mode}`.localeCompare(`${right.caseId}:${right.mode}`),
    ),
  })
  const formatted = `${formatReceiptJson(file)}`
  const existingText = existsSync(path) ? await readFile(path, "utf8") : undefined
  const changed = existingText !== formatted

  if (changed) {
    await mkdir(dirname(path), { recursive: true })
    await writeFile(path, formatted)
  }

  return { path, changed, frames: file.frames.length }
}

export function validateGeneratedFrameProvenance({
  repoRoot,
  contract,
  caseEntry,
  context,
  requireProvenance = false,
}) {
  const provenancePath = generatedFrameProvenancePath(repoRoot, contract.family)
  if (!existsSync(provenancePath)) {
    return {
      status: requireProvenance ? "fail" : "warn",
      details: [`missing: ${provenancePath}`],
    }
  }

  let provenance
  try {
    provenance = readJsonFile(provenancePath)
  } catch (error) {
    return { status: "fail", details: [`invalid JSON: ${error.message}`] }
  }

  const entry = findGeneratedFrameProvenanceEntry(provenance, caseEntry.caseId, caseEntry.mode)
  if (!entry) {
    return {
      status: requireProvenance ? "fail" : "warn",
      details: [`missing case provenance: ${caseEntry.caseId} ${caseEntry.mode}`],
    }
  }

  const sourceFrameId = resolveSourceFrameId(repoRoot, contract, caseEntry)
  const sourceNodeIds = sourceNodeIdsForCase(caseEntry)
  const expected = {
    schemaVersion: generatedFrameProvenanceSchemaVersion,
    family: contract.family,
    figmaFileKey: contract.figmaFileKey,
    caseId: caseEntry.caseId,
    mode: caseEntry.mode,
    figmaFrameName: caseEntry.figmaFrameName,
    sourceFrameId: sourceFrameId ?? null,
    sourceNodeId: caseEntry.source?.componentNodeId ?? null,
    sourceNodeIds,
    viewport: caseEntry.viewport,
    viewportSize: caseEntry.viewportSize,
    framing: caseEntry.framing ?? null,
    exportScale: caseEntry.exportScale ?? 1,
    sourceFingerprint: computeSourceFingerprint(context.rawSource, sourceNodeIds),
    caseFingerprint: computeCaseFingerprint({ contract, caseEntry, sourceFrameId }),
    prepFingerprint: computePrepFingerprint(caseEntry),
  }

  const issues = []
  if (provenance.schemaVersion !== expected.schemaVersion) issues.push("schemaVersion mismatch")
  if (provenance.family !== expected.family) issues.push("family mismatch")
  if (provenance.figmaFileKey !== expected.figmaFileKey) issues.push("figmaFileKey mismatch")

  for (const field of [
    "caseId",
    "mode",
    "figmaFrameName",
    "sourceFrameId",
    "sourceNodeId",
    "viewport",
    "exportScale",
    "sourceFingerprint",
    "caseFingerprint",
    "prepFingerprint",
  ]) {
    if (stableStringify(entry[field]) !== stableStringify(expected[field])) {
      issues.push(`${field} mismatch`)
    }
  }

  for (const field of ["sourceNodeIds", "viewportSize", "framing"]) {
    if (stableStringify(entry[field]) !== stableStringify(expected[field])) {
      issues.push(`${field} mismatch`)
    }
  }

  if (!figmaNodeIdPattern.test(entry.figmaFrameId ?? "")) {
    issues.push(
      `figmaFrameId is not a concrete Figma node id: ${entry.figmaFrameId ?? "undefined"}`,
    )
  }

  if (!entry.requestHash || typeof entry.requestHash !== "string") {
    issues.push("requestHash missing")
  }

  if (issues.length > 0) {
    return {
      status: "fail",
      details: issues,
    }
  }

  return {
    status: "pass",
    details: [
      `${provenancePath}`,
      `${entry.figmaFrameId}: ${entry.figmaFrameName}`,
      `sourceFingerprint: ${entry.sourceFingerprint.slice(0, 12)}`,
      `prepFingerprint: ${entry.prepFingerprint.slice(0, 12)}`,
      `approval: ${entry.approval ?? "unreviewed"}`,
    ],
  }
}
