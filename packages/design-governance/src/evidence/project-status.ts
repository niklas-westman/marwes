import { join } from "node:path"
import { compileFamily } from "../compile/compile-family.js"
import { type CoverageAssessment, familyCoverage } from "../contracts/coverage.js"
import {
  type ProjectInventory,
  type ProjectProof,
  type ProjectProofState,
  projectInventory,
  projectProofs,
} from "../contracts/project-inventory.js"
import { type GovernanceReport, adapters } from "../contracts/report.js"
import { requireValue } from "../contracts/require-value.js"
import { type BehaviorContract, loadBehaviorContract } from "../runtime/behavior.js"
import { validatePortableIntegrity } from "../source/portable-integrity.js"
import { getCatalog, inputFingerprint, readReport } from "./store.js"

export type ProjectGroupEvidence = {
  report: GovernanceReport
  coverage: CoverageAssessment
  behavior: BehaviorContract | undefined
  integrity: "passed" | "failed"
}

/** Reports must first pass readReport's current-input and artifact verification. */
export function assessProjectGroupEvidence({
  report,
  coverage,
  behavior,
  integrity,
}: ProjectGroupEvidence): Record<ProjectProof, ProjectProofState> {
  const states = Object.fromEntries(projectProofs.map((key) => [key, "unverified"])) as Record<
    ProjectProof,
    ProjectProofState
  >
  if (report.freshness.state !== "current" || report.environment.evidenceScope !== "active")
    return states
  states.source =
    integrity === "passed" && report.cases.every((item) => item.outcomes.integrity === "passed")
      ? "passed"
      : integrity === "failed"
        ? "failed"
        : "unverified"
  states.promotion = states.source
  states.inventory =
    coverage.complete &&
    coverage.requiredItems > 0 &&
    report.outcome === "passed" &&
    report.cases.every((item) => item.outcomes.coverage === "passed")
      ? "passed"
      : "missing"
  const requirements = coverage.items.filter((item) => item.caseId)
  const required = new Map(
    requirements.map((item) => [
      `${item.caseId}:${item.mode}`,
      { caseId: requireValue(item.caseId), mode: item.mode },
    ]),
  )
  for (const scenario of behavior?.scenarios ?? [])
    required.set(`${scenario.caseId}:${scenario.mode}`, scenario)
  const identities = [...required.values()].flatMap((item) =>
    adapters.map((adapter) => `${item.caseId}:${adapter}:${item.mode}`),
  )
  const actual = report.cases.map((item) => `${item.caseId}:${item.adapter}:${item.mode}`)
  const completeScope =
    identities.length > 0 &&
    new Set(actual).size === actual.length &&
    requirements.length === coverage.items.length &&
    identities.every((identity) => actual.includes(identity))
  states.fixture = completeScope ? "passed" : "missing"
  function proof(key: "structural" | "visual" | "behavior"): ProjectProofState {
    const selected = requirements.filter((item) => item.requiredProofs.includes(key))
    if (!completeScope || !selected.length) return "unverified"
    const rows = selected.flatMap((item) =>
      report.cases.filter((row) => row.caseId === item.caseId && row.mode === item.mode),
    )
    if (rows.some((item) => ["failed", "error"].includes(item.outcomes[key]))) return "failed"
    return rows.every(
      (item) =>
        item.outcomes[key] === "passed" &&
        (key !== "visual" ||
          ["reference", "actual", "diff"].every((role) =>
            item.artifacts.some(
              (artifact) => artifact.role === role && artifact.mimeType.startsWith("image/"),
            ),
          )),
    )
      ? "passed"
      : "unverified"
  }
  states.structural = proof("structural")
  states.visual = proof("visual")
  if (behavior?.applicability.kind === "noninteractive") {
    states.behavior = requirements.some((item) => item.requiredProofs.includes("behavior"))
      ? "failed"
      : "passed"
  } else if (
    behavior?.applicability.kind === "interactive" &&
    behavior.scenarios.length &&
    completeScope
  ) {
    const rows = behavior.scenarios.flatMap((scenario) =>
      report.cases.filter((row) => row.caseId === scenario.caseId && row.mode === scenario.mode),
    )
    const requiredRows = requirements.filter((item) => item.requiredProofs.includes("behavior"))
    const scenariosCoverRequired = requiredRows.every((item) =>
      behavior.scenarios.some(
        (scenario) => scenario.caseId === item.caseId && scenario.mode === item.mode,
      ),
    )
    states.behavior = rows.some((row) => ["failed", "error"].includes(row.outcomes.behavior))
      ? "failed"
      : scenariosCoverRequired &&
          rows.every(
            (row) =>
              row.outcomes.behavior === "passed" &&
              row.artifacts.some((artifact) => artifact.role === "behavior"),
          )
        ? "passed"
        : "unverified"
  }
  // readReport binds review to every report identity. A subset report still cannot certify a family.
  states.review =
    report.review.state === "accepted" && completeScope && coverage.complete
      ? "passed"
      : report.review.state === "rejected"
        ? "failed"
        : "unverified"
  return states
}

/** Whole-project certification cannot be inferred from the enrolled visual subset. */
export function projectStatus(
  repoRoot: string,
  options: {
    uiIntegrationAccepted?: boolean
    catalog?: ReturnType<typeof getCatalog>
  } = {},
): ProjectInventory & { evidenceErrors: Record<string, string> } {
  const catalog = options.catalog ?? getCatalog(repoRoot)
  const fingerprint = inputFingerprint(repoRoot)
  const evidenceErrors: Record<string, string> = {}
  const result = projectInventory(
    repoRoot,
    (group) => {
      const selection = catalog.families.find((family) => family.family === group)
      if (!selection?.runId) {
        if (selection?.error) evidenceErrors[group] = selection.error
        return {}
      }
      try {
        const report = readReport(repoRoot, selection.runId, fingerprint)
        if (report.family !== group) throw Error("Latest run belongs to another validation group")
        const coverage = familyCoverage(repoRoot, group, compileFamily(repoRoot, group))
        return assessProjectGroupEvidence({
          report,
          coverage,
          behavior: loadBehaviorContract(repoRoot, group),
          integrity: validatePortableIntegrity(repoRoot, group).status,
        })
      } catch (error) {
        evidenceErrors[group] = String(error)
        return {}
      }
    },
    options,
  )
  for (const [group, error] of Object.entries(evidenceErrors))
    result.gaps.push(`${group}: Invalid evidence: ${error}`)
  result.complete = result.complete && Object.keys(evidenceErrors).length === 0
  return { ...result, evidenceErrors }
}

export function assertProjectEnrollment(status: ProjectInventory): void {
  const missing = status.families.flatMap((family) =>
    family.validationGroups
      .filter(
        (group) =>
          !group.enrolled ||
          group.requiredItems === null ||
          ["source", "inventory", "fixture", "structural"].some((key) =>
            ["missing", "failed"].includes(group.states[key as ProjectProof]),
          ),
      )
      .map((group) => `${family.family}/${group.group}`),
  )
  const reasons = [...status.enrollmentGaps, ...missing]
  if (reasons.length) throw Error(`Project enrollment incomplete: ${reasons.join(", ")}`)
}

export function assertProjectCompletion(status: ProjectInventory): void {
  if (!status.complete) throw Error(`Project certification incomplete: ${status.gaps.join("; ")}`)
}
