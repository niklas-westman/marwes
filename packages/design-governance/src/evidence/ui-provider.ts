import type { CoverageItem } from "../contracts/coverage.js"
import { projectInventory } from "../contracts/project-inventory.js"
import { type GovernanceReport, adapters } from "../contracts/report.js"
import { requireValue } from "../contracts/require-value.js"
import { projectStatus } from "./project-status.js"
import { getCatalog, inputFingerprint, readReport } from "./store.js"

/** Proposed Marwes provider contract, not Reflection's native report schema. */
export const providerSchema = "marwes.reflection-ui-provider/v1" as const
export type ProviderGroup = {
  family: string
  cases?: { caseId: string; mode: string; adapter: string; proofScope?: "behavior-only" }[]
  coverage?: {
    items?: (Omit<CoverageItem, "requiredProofs"> &
      Partial<Pick<CoverageItem, "requiredProofs">> & {
        evidenceMatch?: "matched" | "changed" | "missing"
      })[]
    requiredItems?: number
    coveredItems?: number
    complete?: boolean
    uncovered?: string[]
    error?: string
  }
  runId?: string | null
  inputScope?: string
  stageId?: string | null
  stageHash?: string | null
  outcome?: string
  freshness?: GovernanceReport["freshness"]
  review?: GovernanceReport["review"]
  error?: string | null
}
export type ProviderCatalog = { families: ProviderGroup[] }
export type ProviderOperations = {
  getCatalog(root: string): ProviderCatalog | Promise<ProviderCatalog>
  readReport(root: string, id: string): GovernanceReport | Promise<GovernanceReport>
}
export type ProviderReport = GovernanceReport | { error: string }
const identity = (...parts: string[]) => JSON.stringify(parts)

/** Pure projection. Outcomes and freshness belong to the provider, never the viewer. */
export function projectUIEvidence(input: {
  project: { id: string; label: string }
  catalog: ProviderCatalog
  reports: Map<string, ProviderReport>
  implementations?: { id: string; label: string }[]
}) {
  const implementations = input.implementations ?? adapters.map((id) => ({ id, label: id }))
  const families = input.catalog.families.map((group) => {
    const loaded = group.runId ? input.reports.get(group.runId) : undefined
    const report = loaded && !("error" in loaded) ? loaded : undefined
    if (report && (report.runId !== group.runId || report.family !== group.family))
      throw Error("Provider report identity differs from selected group/run")
    const results = new Map<string, GovernanceReport["cases"][number]>()
    for (const item of report?.cases ?? []) {
      const key = identity(item.caseId, item.mode, item.adapter)
      if (results.has(key)) throw Error("Duplicate provider comparison identity")
      results.set(key, item)
    }
    const inventory = [...(group.coverage?.items ?? [])]
    // Legacy contracts remain inspectable without claiming their inventory is complete.
    for (const item of group.cases ?? [])
      if (!inventory.some((row) => row.caseId === item.caseId && row.mode === item.mode))
        inventory.push({
          itemId: identity(item.caseId, item.mode),
          label: item.caseId,
          caseId: item.caseId,
          mode: item.mode,
          requiredProofs:
            item.proofScope === "behavior-only" ? ["behavior"] : ["structural", "visual"],
          gaps: ["Required inventory is incomplete for this registered selection"],
        })
    const itemIds = new Set<string>()
    const items = inventory.map((item) => {
      if (itemIds.has(item.itemId)) throw Error("Duplicate provider required item identity")
      itemIds.add(item.itemId)
      const visualRequired = item.requiredProofs?.includes("visual") ?? false
      const structuralRequired = item.requiredProofs?.includes("structural") ?? false
      const definitionMatches = !item.evidenceMatch || item.evidenceMatch === "matched"
      return {
        id: item.itemId,
        label: item.label,
        dimensions: { ...(item.dimensions ?? {}), mode: item.mode },
        caseId: item.caseId ?? null,
        requiredProofs: item.requiredProofs ?? [],
        visualRequired,
        source: item.source ? { ...item.source, url: item.sourceUrl ?? null } : null,
        gaps: item.gaps,
        comparisons: implementations.map((implementation) => {
          const result =
            item.caseId && definitionMatches
              ? results.get(identity(item.caseId, item.mode, implementation.id))
              : undefined
          return {
            id: identity(group.family, item.itemId, implementation.id, group.runId ?? ""),
            implementationId: implementation.id,
            runId: report?.runId ?? null,
            state: !definitionMatches ? "unmatched" : result ? "recorded" : "missing",
            visualRequired,
            outcomes: result?.outcomes ?? null,
            measurements: structuralRequired ? (result?.measurements ?? []) : [],
            gaps: !definitionMatches
              ? ["Required selection differs from the exact run inputs"]
              : (result?.unsupported ?? ["No exact case/mode/implementation result in this run"]),
            limitations: result?.limitations ?? [],
            sourceUrl: visualRequired || structuralRequired ? (result?.sourceUrl ?? null) : null,
            artifacts: (result?.artifacts ?? [])
              .filter(
                (artifact) =>
                  visualRequired ||
                  (artifact.role === "behavior" && !artifact.mimeType.startsWith("image/")),
              )
              .map((artifact) => ({
                id: identity(requireValue(report).runId, artifact.path),
                // Legacy artifacts without explicit role are retained as evidence, never guessed.
                role: artifact.role ?? "evidence",
                sha256: artifact.sha256,
                mimeType: artifact.mimeType,
                href: `/api/artifact?run=${encodeURIComponent(requireValue(report).runId)}&path=${encodeURIComponent(artifact.path)}`,
              })),
          }
        }),
      }
    })
    return {
      id: group.family,
      outcome: group.outcome ?? "blocked",
      inventory: {
        requiredItems: group.coverage?.requiredItems ?? null,
        coveredItems: group.coverage?.coveredItems ?? null,
        complete: group.coverage?.complete ?? false,
        gaps: group.coverage?.uncovered ?? [],
        error: group.coverage?.error ?? null,
      },
      freshness: group.freshness ?? { state: "never-run", reasons: [] },
      review: group.review ?? { state: "unreviewed" },
      scope: {
        kind: group.inputScope ?? "active",
        stageId: group.stageId ?? null,
        stageHash: group.stageHash ?? null,
      },
      error: loaded && "error" in loaded ? loaded.error : (group.error ?? null),
      run: report
        ? {
            id: report.runId,
            startedAt: report.startedAt,
            finishedAt: report.finishedAt,
            fingerprint: report.fingerprint,
            environment: report.environment,
            freshness: report.freshness,
            review: report.review,
            outcome: report.outcome,
          }
        : null,
      items,
    }
  })
  return {
    schema: providerSchema,
    project: input.project,
    implementations,
    integration: {
      state: "provider-ready-ui-unavailable",
      reason:
        "Reflection provides the engine; a runnable reflection-check-ui provider consumer has not been supplied.",
    },
    capabilities: {
      readArtifacts: true,
      startValidation: true,
      acceptReview: false,
      promoteReferences: false,
      validation: {
        endpoint: "/api/jobs",
        method: "POST",
        capabilityHeader: "X-Governance-Capability",
        capabilityEndpoint: "/api/catalog",
        fields: ["family", "adapter", "stageId"],
      },
    },
    families,
  }
}

/** Only core-validated reports enter the projection. Failure never selects an older run. */
export async function createUIProvider(repoRoot: string, operations?: ProviderOperations) {
  const fingerprint = operations ? undefined : inputFingerprint(repoRoot)
  const core = operations ?? {
    getCatalog,
    readReport: (root: string, id: string) => readReport(root, id, fingerprint),
  }
  const suppliedCatalog = await core.getCatalog(repoRoot)
  const catalog = { families: [...suppliedCatalog.families] }
  // Keep active enrollment readiness separate from a staged run's comparison results.
  const publicInventory = operations ? projectInventory(repoRoot) : projectStatus(repoRoot)
  const requiredGroups = new Set(
    publicInventory.families.flatMap((family) =>
      family.validationGroups.map((group) => group.group),
    ),
  )
  catalog.families = catalog.families.filter(
    (group) => requiredGroups.has(group.family) || group.cases?.length || group.runId,
  )
  for (const family of publicInventory.families)
    for (const group of family.validationGroups)
      if (!catalog.families.some((entry) => entry.family === group.group))
        catalog.families.push({
          family: group.group,
          coverage: { uncovered: group.gaps },
          outcome: "blocked",
          error: "No validation group contract enrolled",
        })
  const reports = new Map<string, ProviderReport>()
  for (const group of catalog.families) {
    if (!group.runId || reports.has(group.runId)) continue
    try {
      reports.set(group.runId, await core.readReport(repoRoot, group.runId))
    } catch (error) {
      reports.set(group.runId, { error: String(error) })
    }
  }
  return {
    ...projectUIEvidence({ project: { id: "marwes", label: "Marwes" }, catalog, reports }),
    publicInventory: { ...publicInventory, scope: "active" as const },
  }
}
