import { deriveReadiness, summarizeProjection } from "reflection-projection"
import { describe, expect, it } from "vitest"
import type { CoverageContract } from "../contracts/coverage.ts"
import {
  type Adapter,
  type CaseReport,
  type GovernanceReport,
  adapters,
} from "../contracts/report.ts"
import { type EngineRun, type FamilyEvidence, projectFamily } from "./reflection-bundle.ts"

const coverage: CoverageContract = {
  schemaVersion: 1,
  family: "button",
  figmaFileKey: "file",
  items: [
    {
      itemId: "design.primary.default",
      label: "Primary default",
      mode: "light",
      caseId: "button.basic",
      dimensions: { variant: "primary", state: "default" },
      source: { nodeId: "1:1" },
      requiredProofs: ["structural", "visual", "behavior"],
    },
    {
      itemId: "design.secondary.default",
      label: "Secondary default",
      mode: "light",
      caseId: "button.secondary",
      dimensions: { variant: "secondary", state: "default" },
      source: { nodeId: "1:2" },
      requiredProofs: ["structural", "visual", "behavior"],
    },
    {
      itemId: "public.keyboard",
      label: "Keyboard activation",
      mode: "light",
      caseId: "button.basic",
      dimensions: { state: "default" },
      requiredProofs: ["behavior"],
    },
    {
      itemId: "design.xs.default",
      label: "XS default",
      mode: "light",
      source: { availability: "needs-design", reason: "No XS design" },
      requiredProofs: ["structural", "visual", "behavior"],
    },
    {
      itemId: "public.focus",
      label: "Focus",
      mode: "light",
      source: { availability: "rule-defined" },
      requiredProofs: ["structural", "visual", "behavior"],
    },
  ],
}

const row = (caseId: string, adapter: Adapter, visual: "passed" | "failed"): CaseReport => ({
  caseId,
  adapter,
  mode: "light",
  sourceUrl: "https://example.test/design",
  measurements: [],
  // Marwes folds family coverage gaps into every case; the bridge must not forward that.
  outcomes: {
    integrity: "passed",
    structural: "passed",
    visual,
    behavior: "passed",
    coverage: "unsupported",
  },
  unsupported: ["Family coverage: public.focus.light: Runtime fixture not enrolled"],
  artifacts: [],
})

const engine = (adapter: Adapter): EngineRun => ({
  runId: `run-${adapter}`,
  finishedAt: "2026-10-20T00:00:00.000Z",
  engineVersion: "0.7.0",
  inputs: [],
  checks: new Map(),
})

function evidence(cases: CaseReport[]): FamilyEvidence {
  const report: GovernanceReport = {
    schemaVersion: 1,
    runId: "gov-run",
    family: "button",
    startedAt: "2026-10-20T00:00:00.000Z",
    finishedAt: "2026-10-20T00:01:00.000Z",
    fingerprint: "f",
    environment: {},
    cases,
    freshness: { state: "current", reasons: [] },
    review: { state: "unreviewed" },
    outcome: "blocked",
  }
  const snap = { capturedAt: "2026-10-14T00:00:00.000Z", sha256: "a".repeat(64), fileKey: "file" }
  return {
    family: "button",
    label: "Button",
    projectId: "marwes",
    projectName: "Marwes",
    coverage,
    report,
    engineRuns: Object.fromEntries(adapters.map((a) => [a, engine(a)])) as Record<
      Adapter,
      EngineRun
    >,
    acceptedDeviations: new Map(),
    snapshots: { sync: snap, source: snap, requiredSet: snap },
    generatedAt: "2026-10-20T00:00:00.000Z",
    imageFor: () => undefined,
  }
}

const allAdapters = (caseId: string, visual: "passed" | "failed" = "passed") =>
  adapters.map((adapter) => row(caseId, adapter, visual))

const readinessOf = (cases: CaseReport[], id: string) => {
  const { projection } = projectFamily(evidence(cases))
  const requirement = projection.requirements?.find((item) => item.id === id)
  if (!requirement) throw new Error(`missing ${id}`)
  return deriveReadiness(
    requirement,
    projection.comparisons ?? [],
    projection.provider.readinessConcepts,
  )
}

describe("projectFamily", () => {
  it("proves a requirement only when every required layer passes in every adapter", () => {
    expect(readinessOf(allAdapters("button.basic"), "design.primary.default")).toBe("proven")
  })

  it("reads a failing comparison as failing", () => {
    const cases = [...allAdapters("button.basic"), ...allAdapters("button.secondary", "passed")]
    cases[4] = row("button.secondary", "vue", "failed")
    expect(readinessOf(cases, "design.secondary.default")).toBe("failing")
  })

  it("does not call a requirement compared in React only proven", () => {
    const cases = [row("button.basic", "react", "passed")]
    expect(readinessOf(cases, "design.primary.default")).not.toBe("proven")
  })

  it("gives a requirement that shares a case its own comparison and proof", () => {
    const { projection } = projectFamily(evidence(allAdapters("button.basic")))
    const own = (projection.comparisons ?? []).filter((c) => c.requirementId === "public.keyboard")
    expect(own).toHaveLength(3)
    expect(readinessOf(allAdapters("button.basic"), "public.keyboard")).toBe("proven")
  })

  it("keeps missing design and unenrolled rules out of proof", () => {
    const summary = summarizeProjection(
      projectFamily(evidence(allAdapters("button.basic"))).projection,
    )
    expect(summary).toMatchObject({ required: 5, needsDesign: 1, notEnrolled: 1 })
  })

  it("never forwards a folded status word", () => {
    const { projection } = projectFamily(evidence(allAdapters("button.basic")))
    expect(JSON.stringify(projection)).not.toMatch(/blocked/i)
    for (const comparison of projection.comparisons ?? [])
      expect(Object.keys(comparison.proof)).not.toContain("coverage")
  })

  it("keeps an owner-accepted deviation visible on the comparison", () => {
    const base = evidence(allAdapters("button.basic"))
    const accepted = new Map([
      [JSON.stringify(["button.basic", "light"]), "Owner-accepted deviation (DC-011)"],
    ])
    const { projection } = projectFamily({ ...base, acceptedDeviations: accepted })
    const visual = (projection.comparisons ?? []).find(
      (c) => c.requirementId === "design.primary.default",
    )
    expect(visual?.limitations).toContain("Owner-accepted deviation (DC-011)")
  })
})
