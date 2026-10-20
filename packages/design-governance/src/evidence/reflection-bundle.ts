import { execFileSync } from "node:child_process"
import { existsSync, readFileSync, readdirSync } from "node:fs"
import { basename, dirname, join, relative, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import type { Comparison, Projection, Requirement } from "reflection-projection"
import type { BundleFileInput } from "reflection-projection/node"
import type { CoverageContract, CoverageRequirement } from "../contracts/coverage.js"
import {
  type Adapter,
  type CaseReport,
  type GovernanceReport,
  type ProofOutcome,
  adapters,
} from "../contracts/report.js"
import { requireValue } from "../contracts/require-value.js"
import { familyRoot, readJson } from "../source/snapshot.js"
import { evidenceRoot, hash, readReport } from "./store.js"

type Layer = "integrity" | "structural" | "visual" | "behavior"
type Proof = "passed" | "failed" | "not-run" | "unsupported"
const layers: Layer[] = ["integrity", "structural", "visual", "behavior"]

/** What one Reflection engine run recorded for one adapter, read from its report.json. */
export interface EngineRun {
  runId: string
  startedAt?: string
  finishedAt: string
  engineVersion: string
  inputs: {
    role: string
    key: string
    hashKind: string
    sha256?: string
    bytes?: number
    missing?: boolean
  }[]
  resultHash?: { verdict?: string; measured?: string }
  checks: Map<string, { diffPixels?: number; diffRatio?: number; maxDiffPixels?: number }>
}

export interface ReferenceApproval {
  state: "holds" | "lapsed"
  attestation: "human" | "delegated" | "agent"
  by?: string
  recordedBy?: string
  at?: string
  note?: string
  boundTo?: string
}

/** Everything the mapping needs, already read from disk; the mapping itself does no I/O. */
export interface FamilyEvidence {
  family: string
  label: string
  projectId: string
  projectName: string
  coverage: RequiredSet
  /** `executed-only` when the family has no inventory: required items are then only what ran. */
  inventory: "full" | "executed-only"
  report: GovernanceReport
  engineRuns: Record<Adapter, EngineRun>
  acceptedDeviations: Map<string, string>
  caseSettings: Map<string, { viewport?: string; threshold?: Record<string, number> }>
  approval?: ReferenceApproval
  snapshots: {
    sync: {
      capturedAt: string
      upstreamModifiedAt?: string
      version?: string
      versionTag?: string
      sha256: string
      fileKey: string
      originalFileKey?: string
      note?: string
    }
    source: {
      capturedAt: string
      upstreamModifiedAt?: string
      version?: string
      sha256: string
      fileKey: string
      note?: string
    }
    /** Absent when the family keeps no required-set inventory of its own. */
    requiredSet?: { capturedAt: string; sha256: string; fileKey: string }
  }
  generatedAt: string
  /** Image file for one comparison and role, relative to nothing: an absolute path on disk or undefined. */
  imageFor(row: CaseReport, role: "reference" | "actual" | "diff"): string | undefined
}

export type BundleFile = BundleFileInput

export type RequiredItem = Omit<CoverageRequirement, "requiredProofs"> & {
  requiredProofs: Requirement["requiredProofs"]
}
export interface RequiredSet {
  family: string
  figmaFileKey: string
  items: RequiredItem[]
}

const snapshotIdsFor = (family: string) =>
  ({
    sync: "figma-sync",
    source: `${family}-source-capture`,
    requiredSet: `${family}-required-set`,
  }) as const

const toProof = (outcome: ProofOutcome | undefined): Proof => {
  if (outcome === "passed" || outcome === "failed" || outcome === "unsupported") return outcome
  if (outcome === "error") return "failed"
  return "not-run"
}

/** Marwes folds coverage gaps into every case; coverage is not a proof layer and never forwarded. */
export function proofOf(row: CaseReport, required: Layer[]): Partial<Record<Layer, Proof>> {
  // A layer that did not run and is not required is left out, as the provider guide asks, so it
  // cannot turn a comparison whose required layers passed into "not run".
  return Object.fromEntries(
    layers
      .map((layer) => [layer, toProof(row.outcomes[layer])] as const)
      .filter(
        ([layer, proof]) => required.includes(layer) || proof === "passed" || proof === "failed",
      ),
  )
}

function verdictOf(required: Layer[], proof: Partial<Record<Layer, Proof>>): Comparison["verdict"] {
  if (required.some((layer) => proof[layer] === "failed"))
    return { status: "fail", severity: "blocking", failureClass: "proof-failed" }
  if (required.every((layer) => proof[layer] === "passed"))
    return { status: "pass", severity: "info" }
  return { status: "skipped", severity: "info" }
}

function requirementOf(item: RequiredItem, family: string): Requirement {
  const dimensions = item.dimensions ?? {}
  const { variant, state, ...rest } = dimensions
  const availability = item.source?.availability
  const design: Requirement["design"] =
    availability === "needs-design"
      ? { availability: "missing", ...(item.source?.reason ? { reason: item.source.reason } : {}) }
      : !item.caseId && (availability === "needs-mapping" || availability === "rule-defined")
        ? {
            availability: "unmapped",
            ...(item.source?.nodeId ? { nodeId: item.source.nodeId } : {}),
            ...(item.source?.reason ? { reason: item.source.reason } : {}),
          }
        : {
            availability: "available",
            ...(item.source?.nodeId ? { nodeId: item.source.nodeId } : {}),
          }
  return {
    id: item.itemId,
    label: item.label,
    subject: {
      kind: "component",
      id: family,
      ...(variant ? { variant } : {}),
      mode: item.mode,
      ...(state ? { state } : {}),
      dimensions: rest,
    },
    requiredProofs: item.requiredProofs,
    requiredImplementations: [...adapters],
    enrolled: Boolean(item.caseId),
    design: { ...design, ...(item.caseId ? { snapshotId: snapshotIdsFor(family).source } : {}) },
  }
}

const imageSize = (file: string): { width: number; height: number } => {
  const header = readFileSync(file).subarray(0, 24)
  return { width: header.readUInt32BE(16), height: header.readUInt32BE(20) }
}

const caseKey = (caseId: string, mode: string) => JSON.stringify([caseId, mode])
const engineCheckId = (adapter: Adapter, caseId: string, mode: string) =>
  `visual.${adapter}.${caseId}.${mode}`

export function projectFamily(evidence: FamilyEvidence): {
  projection: Projection
  files: BundleFile[]
} {
  const ids = snapshotIdsFor(evidence.family)
  const { coverage, report } = evidence
  const requirements = coverage.items.map((item) => requirementOf(item, evidence.family))
  const rows = new Map(
    report.cases.map((row) => [`${caseKey(row.caseId, row.mode)}|${row.adapter}`, row]),
  )
  const files: BundleFile[] = []
  const comparisons: Comparison[] = []
  // One comparison per requirement and adapter: several requirements may be proven by the same case
  // (a behavior-only item attaches to an existing visual case), and each needs its own proof.
  for (const item of coverage.items) {
    if (!item.caseId) continue
    for (const adapter of adapters) {
      const row = rows.get(`${caseKey(item.caseId, item.mode)}|${adapter}`)
      if (!row) continue
      const withVisual = item.requiredProofs.includes("visual")
      const withStructural = item.requiredProofs.includes("structural")
      const proof = proofOf(row, item.requiredProofs)
      const run = evidence.engineRuns[row.adapter]
      const check = run.checks.get(engineCheckId(row.adapter, row.caseId, row.mode))
      const id = `${item.itemId}/${row.adapter}`
      const artifact = (role: "reference" | "actual" | "diff") => {
        const from = evidence.imageFor(row, role)
        if (!from) return undefined
        const path = `artifacts/${evidence.family}/${row.adapter}/${item.itemId}.${role}.png`
        files.push({ path, kind: "artifact", fromFile: from })
        return { role, path, mime: "image/png", ...imageSize(from) }
      }
      const reference = withVisual ? artifact("reference") : undefined
      const actual = withVisual ? artifact("actual") : undefined
      const diffArtifact = withVisual ? artifact("diff") : undefined
      const settings = evidence.caseSettings.get(caseKey(row.caseId, row.mode))
      const accepted = withVisual
        ? evidence.acceptedDeviations.get(caseKey(row.caseId, row.mode))
        : undefined
      const integrityNote =
        row.outcomes.integrity === "failed"
          ? [
              ...new Set(
                row.unsupported
                  .filter((entry) => !entry.startsWith("Family coverage"))
                  .map((entry) => entry.replace(/^Error: /, "")),
              ),
            ]
          : []
      const limitations = [
        ...(row.limitations ?? []),
        ...integrityNote.map((entry) => `Integrity failed: ${entry}`),
        ...(accepted ? [accepted] : []),
      ]
      comparisons.push({
        id,
        requirementId: item.itemId,
        subject: {
          ...requireValue(requirements.find((r) => r.id === item.itemId)).subject,
          adapter: row.adapter,
          ...(withVisual && settings?.viewport ? { viewport: settings.viewport } : {}),
        },
        snapshotId: ids.source,
        runId: `${row.adapter}:${run.runId}`,
        ...(reference
          ? {
              reference: {
                artifact: reference,
                origin: "figma-export",
                approval: evidence.approval
                  ? {
                      state: evidence.approval.state,
                      attestation: evidence.approval.attestation,
                      ...(evidence.approval.by ? { by: evidence.approval.by } : {}),
                      ...(evidence.approval.recordedBy
                        ? { recordedBy: evidence.approval.recordedBy }
                        : {}),
                      ...(evidence.approval.at ? { at: evidence.approval.at } : {}),
                      ...(evidence.approval.note ? { note: evidence.approval.note } : {}),
                      ...(evidence.approval.boundTo ? { boundTo: evidence.approval.boundTo } : {}),
                    }
                  : { state: "none" },
              },
            }
          : {}),
        ...(actual ? { actual } : {}),
        ...(withVisual && check?.diffPixels !== undefined
          ? {
              diff: {
                ...(diffArtifact ? { artifact: diffArtifact } : {}),
                metric: {
                  name: "diffPixels",
                  value: check.diffPixels,
                  diffPixels: check.diffPixels,
                  ...(check.diffRatio !== undefined ? { ratio: check.diffRatio } : {}),
                  label: "Differing pixels",
                  unit: "px",
                  direction: "lower-is-better" as const,
                  ...(check.maxDiffPixels !== undefined ? { passAt: check.maxDiffPixels } : {}),
                },
                ...(settings?.threshold ? { threshold: settings.threshold } : {}),
              },
            }
          : {}),
        ...(withStructural && row.measurements.length
          ? {
              measurements: {
                total: row.measurements.length,
                passed: row.measurements.filter((m) => m.outcome === "passed").length,
                samples: row.measurements.map((m) => ({
                  part: m.part,
                  property: m.property,
                  expected: String(m.expected),
                  actual: String(m.actual),
                  ...(m.delta === null ? {} : { delta: String(m.delta) }),
                  tolerance: String(m.tolerance),
                  passed: m.outcome === "passed",
                  ...(m.source.aliasChain?.length ? { tokenChain: m.source.aliasChain } : {}),
                  sourceNodeId: m.source.nodeId,
                })),
              },
            }
          : {}),
        proof,
        verdict: verdictOf(item.requiredProofs, proof),
        ...(row.outcomes.coverage === "unsupported"
          ? { nativeOutcome: "coverage-unsupported" }
          : {}),
        ...(limitations.length ? { limitations } : {}),
      })
    }
  }
  const runs: Projection["runs"] = adapters.map((adapter) => {
    const run = evidence.engineRuns[adapter]
    return {
      id: `${adapter}:${run.runId}`,
      ...(run.startedAt ? { startedAt: run.startedAt } : {}),
      finishedAt: run.finishedAt,
      engine: { name: "reflection-check", version: run.engineVersion },
      runner: { name: "marwes-governance", adapter, governanceRunId: report.runId },
      scope: evidence.family,
      inputs: run.inputs.map((input) => ({
        role: input.role,
        key: input.key,
        hashKind: input.hashKind as "bytes" | "canonical-json" | "composite",
        ...(input.sha256 ? { sha256: input.sha256 } : {}),
        ...(input.bytes !== undefined ? { bytes: input.bytes } : {}),
        ...(input.missing ? { missing: true } : {}),
      })),
      ...(run.resultHash?.verdict ? { verdictHash: run.resultHash.verdict } : {}),
      ...(run.resultHash?.measured ? { measuredHash: run.resultHash.measured } : {}),
    }
  })
  const { sync, source, requiredSet } = evidence.snapshots
  const projection: Projection = {
    schemaVersion: 1,
    project: { id: evidence.projectId, name: evidence.projectName },
    provider: {
      name: "marwes-governance",
      readinessConcepts: { needsDesign: true, notEnrolled: true },
      capabilities: [],
    },
    generatedAt: evidence.generatedAt,
    inventory: evidence.inventory,
    scope: evidence.family,
    subjects: [{ id: evidence.family, kind: "component", label: evidence.label }],
    snapshots: [
      {
        id: ids.sync,
        kind: "design-sync",
        role: "full-sync",
        label: "Full design sync",
        ...sync,
      },
      {
        id: ids.source,
        kind: "design-capture",
        role: "proof-source",
        label: `${evidence.label} source capture`,
        ...source,
      },
      ...(requiredSet
        ? [
            {
              id: ids.requiredSet,
              kind: "inventory",
              role: "required-set",
              label: `${evidence.label} required set`,
              ...requiredSet,
            },
          ]
        : []),
    ],
    requirements,
    comparisons,
    runs,
    decisions: [],
  }
  return { projection, files }
}

/* ---------- reading the evidence from the repository ---------- */

const optionalJson = <T>(path: string): T | undefined =>
  existsSync(path) ? (JSON.parse(readFileSync(path, "utf8")) as T) : undefined

const gitDate = (repoRoot: string, path: string): string => {
  const out = execFileSync("git", ["log", "-1", "--format=%cI", "--", path], { cwd: repoRoot })
    .toString()
    .trim()
  if (!out) throw new Error(`No committed date for ${path}; commit it before building a bundle`)
  return new Date(out).toISOString()
}

function readEngineRun(repoRoot: string, runRoot: string, adapter: Adapter): EngineRun {
  const reports = join(runRoot, `reflection-${adapter}`, "runs")
  const latest = readdirSync(reports)
    .filter((name) => name !== "latest" && existsSync(join(reports, name, "report.json")))
    .sort()
    .at(-1)
  if (!latest) throw new Error(`No Reflection run for ${adapter} in ${runRoot}`)
  const raw = JSON.parse(readFileSync(join(reports, latest, "report.json"), "utf8")) as {
    runId: string
    startedAt?: string
    finishedAt: string
    inputs?: EngineRun["inputs"]
    resultHash?: EngineRun["resultHash"]
    checks: {
      id: string
      metadata?: { diffPixels?: number; diffRatio?: number; threshold?: { maxDiffPixels?: number } }
    }[]
  }
  const entry = fileURLToPath(import.meta.resolve("reflection-check"))
  const engineVersion = (
    JSON.parse(readFileSync(join(dirname(entry), "../package.json"), "utf8")) as { version: string }
  ).version
  return {
    runId: raw.runId,
    ...(raw.startedAt ? { startedAt: raw.startedAt } : {}),
    finishedAt: raw.finishedAt,
    engineVersion,
    // The engine records keys relative to its config folder, which lives inside the run folder.
    // Rebase them onto the repository so they can be re-hashed later from a stable root.
    inputs: (raw.inputs ?? []).map((input) => ({
      ...input,
      key: relative(repoRoot, resolve(runRoot, input.key)),
    })),
    ...(raw.resultHash ? { resultHash: raw.resultHash } : {}),
    checks: new Map(
      raw.checks.map((check) => [
        check.id,
        {
          ...(check.metadata?.diffPixels !== undefined
            ? { diffPixels: check.metadata.diffPixels }
            : {}),
          ...(check.metadata?.diffRatio !== undefined
            ? { diffRatio: check.metadata.diffRatio }
            : {}),
          ...(check.metadata?.threshold?.maxDiffPixels !== undefined
            ? { maxDiffPixels: check.metadata.threshold.maxDiffPixels }
            : {}),
        },
      ]),
    ),
  }
}

export interface BuildOptions {
  family: string
  label: string
  runId: string
  /** Local Figma sync manifest. `.figma/marwes` is untracked and overwritten by each sync. */
  figmaSyncManifest?: string
}

/** Required items for a family without an inventory: one per executed case, in the layers it required. */
function executedItems(report: GovernanceReport): RequiredItem[] {
  const seen = new Map<string, RequiredItem>()
  for (const row of report.cases) {
    const key = caseKey(row.caseId, row.mode)
    if (seen.has(key)) continue
    seen.set(key, {
      itemId: `${row.caseId}.${row.mode}`,
      label: `${row.caseId} · ${row.mode}`,
      mode: row.mode,
      caseId: row.caseId,
      requiredProofs: (row.requiredProofs ?? layers).filter((layer): layer is Layer =>
        layers.includes(layer as Layer),
      ),
    })
  }
  return [...seen.values()]
}

/** Say plainly when a capture predates the full sync, so a superseded source never reads as current. */
function snapshotNote(
  provenance: string | undefined,
  capturedWithSync: boolean,
  syncVersion: string | undefined,
): { note: string } | Record<string, never> {
  const parts = [
    ...(provenance ? [provenance] : []),
    ...(!capturedWithSync && syncVersion
      ? [
          `Not the current sync (${syncVersion}); capture date not recorded, the date shown is the design file's last modification.`,
        ]
      : []),
  ]
  return parts.length ? { note: parts.join(" ") } : {}
}

export function readFamilyEvidence(repoRoot: string, options: BuildOptions): FamilyEvidence {
  const { family } = options
  const directory = join(repoRoot, familyRoot, family)
  const coveragePath = join(directory, "coverage-contract.json")
  const report = readReport(repoRoot, options.runId)
  const runRoot = join(evidenceRoot(repoRoot), options.runId)
  const sourceManifest = readJson<{
    fileKey: string
    snapshotSha256: string
    hashes: { raw: string; manifest: string }
    capture: { version: string; lastModified: string; provenance?: string }
  }>(join(directory, "source/manifest.json"))
  const syncPath = options.figmaSyncManifest ?? join(repoRoot, ".figma/marwes/manifest.json")
  const sync = optionalJson<{
    syncedAt: string
    lastModified: string
    version: string
    versionTag?: string
    fileKey: string
  }>(syncPath)
  // A family with no inventory of its own can only say what ran, so its required items are the
  // executed cases and the inventory is declared as a lower bound.
  const coverage: RequiredSet = existsSync(coveragePath)
    ? readJson<CoverageContract>(coveragePath)
    : {
        family,
        figmaFileKey: sourceManifest.fileKey,
        items: executedItems(report),
      }
  const capturedWithSync = Boolean(sync && sync.version === sourceManifest.capture.version)
  const contract = readJson<{
    cases: {
      caseId: string
      mode: string
      viewport?: string
      comparison?: { toleranceReason?: string; threshold?: Record<string, number> }
    }[]
  }>(join(directory, "reflection-contract.json"))
  const accepted = new Map<string, string>()
  const caseSettings: FamilyEvidence["caseSettings"] = new Map()
  for (const entry of contract.cases) {
    caseSettings.set(caseKey(entry.caseId, entry.mode), {
      ...(entry.viewport ? { viewport: entry.viewport } : {}),
      ...(entry.comparison?.threshold ? { threshold: entry.comparison.threshold } : {}),
    })
    const reason = entry.comparison?.toleranceReason
    if (reason?.startsWith("ACCEPTED TEXT-RASTER DEVIATION"))
      accepted.set(
        caseKey(entry.caseId, entry.mode),
        `Owner-accepted deviation (DC-011): label-only text rendering difference; limit raised to ${entry.comparison?.threshold?.maxDiffPixels} px from the standard limit.`,
      )
  }
  const approvals = optionalJson<{ records: (ReferenceApproval & { scope: string })[] }>(
    join(directory, "reference-approvals.json"),
  )
  const approval = approvals?.records.find((record) => record.scope === "references")
  const engineRuns = Object.fromEntries(
    adapters.map((adapter) => [adapter, readEngineRun(repoRoot, runRoot, adapter)]),
  ) as Record<Adapter, EngineRun>
  return {
    family,
    label: options.label,
    projectId: "marwes",
    projectName: "Marwes",
    coverage,
    inventory: existsSync(coveragePath) ? "full" : "executed-only",
    report,
    engineRuns,
    acceptedDeviations: accepted,
    caseSettings,
    ...(approval ? { approval: { ...approval } } : {}),
    snapshots: {
      sync: {
        capturedAt: sync?.syncedAt ?? sourceManifest.capture.lastModified,
        upstreamModifiedAt: sync?.lastModified ?? sourceManifest.capture.lastModified,
        version: sync?.version ?? sourceManifest.capture.version,
        ...(sync?.versionTag ? { versionTag: sync.versionTag } : {}),
        sha256: sync ? hash(readFileSync(syncPath)) : sourceManifest.hashes.manifest,
        fileKey: sync?.fileKey ?? sourceManifest.fileKey,
        ...(sync
          ? {}
          : {
              note: "Local sync manifest not available; dates come from the family source manifest.",
            }),
      },
      source: {
        capturedAt: capturedWithSync
          ? (sync?.syncedAt ?? sourceManifest.capture.lastModified)
          : sourceManifest.capture.lastModified,
        upstreamModifiedAt: sourceManifest.capture.lastModified,
        version: sourceManifest.capture.version,
        // The compact capture is derived from this raw export, so the raw hash names its content
        // independently of how the compact file is serialized.
        sha256: sourceManifest.hashes.raw,
        fileKey: sourceManifest.fileKey,
        ...snapshotNote(sourceManifest.capture.provenance, capturedWithSync, sync?.version),
      },
      ...(existsSync(coveragePath)
        ? {
            requiredSet: {
              capturedAt: gitDate(repoRoot, join(familyRoot, family, "coverage-contract.json")),
              sha256: hash(readFileSync(coveragePath)),
              fileKey: coverage.figmaFileKey,
            },
          }
        : {}),
    },
    generatedAt: new Date().toISOString(),
    imageFor: (row, role) => {
      const artifact = row.artifacts.find((a) => a.role === role)
      const path = artifact ? join(runRoot, basename(artifact.path)) : undefined
      return path && existsSync(path) ? path : undefined
    },
  }
}

/* ---------- writing the bundle ---------- */

export interface WriteOptions extends BuildOptions {
  release: string
  build: number
  output: string
}

const git = (repoRoot: string, ...args: string[]): string | undefined => {
  try {
    return execFileSync("git", args, { cwd: repoRoot }).toString().trim() || undefined
  } catch {
    return undefined
  }
}

export async function writeFamilyBundle(
  repoRoot: string,
  options: WriteOptions,
): Promise<{ directory: string; projection: Projection }> {
  const { writeBundle } = await import("reflection-projection/node")
  const evidence = readFamilyEvidence(repoRoot, options)
  const { projection, files } = projectFamily(evidence)
  const inventoryPath = join(repoRoot, familyRoot, options.family, "coverage-contract.json")
  if (existsSync(inventoryPath))
    files.push({
      path: `source/${options.family}-required-set.json`,
      kind: "source",
      content: readFileSync(inventoryPath, "utf8"),
    })
  const syncManifest = options.figmaSyncManifest ?? join(repoRoot, ".figma/marwes/manifest.json")
  if (existsSync(syncManifest))
    files.push({
      path: "source/figma-sync-manifest.json",
      kind: "source",
      content: readFileSync(syncManifest, "utf8"),
    })
  const release = {
    release: options.release,
    build: options.build,
    bundleId: `marwes-${options.release}-build-${options.build}`,
    state: "candidate" as const,
    builtAt: evidence.generatedAt,
    ...(git(repoRoot, "rev-parse", "--abbrev-ref", "HEAD")
      ? { branch: git(repoRoot, "rev-parse", "--abbrev-ref", "HEAD") }
      : {}),
    ...(git(repoRoot, "rev-parse", "HEAD") ? { commit: git(repoRoot, "rev-parse", "HEAD") } : {}),
    previousRelease: null,
    snapshotIds: (projection.snapshots ?? []).map((snapshot) => snapshot.id),
  }
  const withRelease = { ...projection, release }
  await writeBundle({
    directory: options.output,
    projection: withRelease,
    release,
    generator: { name: "marwes-governance", version: "1.0.0" },
    files,
  })
  return { directory: options.output, projection: withRelease }
}
