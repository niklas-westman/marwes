import { mkdtempSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import {
  countComparisons,
  deriveReadiness,
  standingDeviations,
  summarizeProjection,
} from "reflection-projection"
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
    inventory: "full",
    report,
    engineRuns: Object.fromEntries(adapters.map((a) => [a, engine(a)])) as Record<
      Adapter,
      EngineRun
    >,
    acceptedDeviations: new Set(),
    caseSettings: new Map(),
    snapshots: { sync: snap, source: snap, requiredSet: snap },
    generatedAt: "2026-10-20T00:00:00.000Z",
    imageFor: () => undefined,
  }
}

const approval = {
  id: "dc-011",
  attestation: "delegated" as const,
  by: "Niklas Westman",
  recordedBy: "Claude (assistant)",
  at: "2026-10-16T00:00:00.000Z",
  comment: '"lets accept the 15"',
  reason: "Label-only text rendering",
}

/** A reference image on disk, so a comparison carries the hash a decision binds to. */
const withReference = (base: FamilyEvidence): FamilyEvidence => {
  const file = join(mkdtempSync(join(tmpdir(), "marwes-ref-")), "reference.png")
  writeFileSync(
    file,
    Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGP4z8DwHwAFAAH/q842iQAAAABJRU5ErkJggg==",
      "base64",
    ),
  )
  return { ...base, imageFor: (_row, role) => (role === "reference" ? file : undefined) }
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

  it("imports an owner-accepted deviation as a decision that still holds, not as proof", () => {
    const base = withReference(evidence(allAdapters("button.basic")))
    const { projection } = projectFamily({
      ...base,
      bundleId: "bundle-a",
      acceptedDeviations: new Set([JSON.stringify(["button.basic", "light"])]),
      deviationApproval: approval,
    })
    const [standing] = standingDeviations(projection, "bundle-a")
    expect(standing?.decision.kind).toBe("accept-deviation")
    expect(standing?.decision.attestation).toBe("delegated")
    // Only the item that requires a visual proof is covered, once per adapter.
    expect(standing?.comparisonIds).toHaveLength(3)
    expect(standing?.standing).toEqual({ state: "holds" })
    // A deviation is review: the comparison keeps its own verdict.
    const visual = (projection.comparisons ?? []).find(
      (c) => c.requirementId === "design.primary.default",
    )
    expect(visual?.verdict.status).toBe("pass")
  })

  it("refuses an accepted deviation that has no owner record", () => {
    const base = withReference(evidence(allAdapters("button.basic")))
    expect(() =>
      projectFamily({
        ...base,
        acceptedDeviations: new Set([JSON.stringify(["button.basic", "light"])]),
      }),
    ).toThrow(/deviation-approvals/)
  })

  it("counts a comparison that read a superseded capture as not proven", () => {
    const base = evidence(allAdapters("button.basic"))
    const { projection } = projectFamily({
      ...base,
      snapshots: { ...base.snapshots, source: { ...base.snapshots.source, superseded: true } },
    })
    expect(projection.snapshots?.find((s) => s.id === "button-source-capture")?.supersededBy).toBe(
      "figma-sync",
    )
    expect(summarizeProjection(projection).proven).toBe(0)
  })

  it("records why integrity failed so a superseded source is not a bare failure", () => {
    const base = allAdapters("button.basic")
    const failing = base.map((entry) => ({
      ...entry,
      outcomes: { ...entry.outcomes, integrity: "failed" as const },
      unsupported: [
        "Error: Invalid compact source identity for button",
        "Invalid compact source identity for button",
        "Family coverage: x",
      ],
    }))
    const { projection } = projectFamily(evidence(failing))
    const own = (projection.comparisons ?? []).find(
      (c) => c.requirementId === "design.primary.default",
    )
    expect(own?.proof.integrity).toBe("failed")
    expect(own?.limitations).toContain(
      "Integrity failed: Invalid compact source identity for button",
    )
    expect(own?.limitations?.join(" ")).not.toContain("Family coverage")
  })

  it("leaves out layers that did not run and were not required", () => {
    const cases = allAdapters("button.basic").map((entry) => ({
      ...entry,
      outcomes: { ...entry.outcomes, structural: "not-run" as const, visual: "not-run" as const },
    }))
    const { projection } = projectFamily(evidence(cases))
    const keyboard = (projection.comparisons ?? []).filter(
      (c) => c.requirementId === "public.keyboard",
    )
    for (const comparison of keyboard)
      expect(Object.keys(comparison.proof)).toEqual(["integrity", "behavior"])
    expect(countComparisons(keyboard)).toMatchObject({ executed: 3, notRun: 0 })
  })
})
