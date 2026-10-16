import { describe, expect, it } from "vitest"
import type { GovernanceReport } from "../contracts/report.js"
import { requireValue } from "../contracts/require-value.js"
import { type ProviderCatalog, createUIProvider, projectUIEvidence } from "./ui-provider.js"

function fixture() {
  const catalog: ProviderCatalog = {
    families: [
      {
        family: "control",
        runId: "run-one",
        outcome: "blocked",
        inputScope: "staged",
        stageId: "01234567-89ab-cdef-0123-456789abcdef",
        stageHash: "b".repeat(64),
        coverage: {
          requiredItems: 2,
          coveredItems: 1,
          complete: false,
          items: [
            {
              itemId: "compact.day",
              label: "Compact",
              caseId: "control.compact",
              mode: "light",
              dimensions: { density: "compact", brand: "north" },
              requiredProofs: ["visual"],
              gaps: [],
            },
            {
              itemId: "roomy.day",
              label: "Roomy",
              mode: "light",
              requiredProofs: ["visual"],
              gaps: ["Fixture missing"],
            },
          ],
        },
      },
    ],
  }
  const report: GovernanceReport = {
    schemaVersion: 1,
    runId: "run-one",
    family: "control",
    startedAt: "2026-10-15T00:00:00Z",
    finishedAt: "2026-10-15T00:00:01Z",
    fingerprint: "a".repeat(64),
    environment: { evidenceScope: "staged", browser: "chromium" },
    freshness: { state: "current", reasons: [] },
    review: { state: "unreviewed" },
    outcome: "blocked",
    cases: [
      {
        caseId: "control.compact",
        adapter: "react",
        mode: "light",
        sourceUrl: "https://example.test/design-spec/compact",
        measurements: [],
        outcomes: {
          integrity: "passed",
          visual: "passed",
          structural: "unsupported",
          behavior: "not-run",
          coverage: "unsupported",
        },
        unsupported: ["Other required selections missing"],
        artifacts: [
          {
            path: "opaque-name.webp",
            sha256: "c".repeat(64),
            mimeType: "image/webp",
            role: "reference",
          },
        ],
      },
    ],
  }
  return { catalog, report }
}
function projection() {
  const { catalog, report } = fixture()
  return projectUIEvidence({
    project: { id: "independent-library", label: "Independent library" },
    catalog,
    reports: new Map([[report.runId, report]]),
  })
}
describe("versioned Reflection UI provider projection", () => {
  it("keeps missing required rows and every implementation without inventing success", () => {
    const result = projection()
    expect(result.schema).toBe("marwes.reflection-ui-provider/v1")
    const group = requireValue(result.families[0])
    expect(group.inventory.requiredItems).toBe(2)
    expect(group.items).toHaveLength(2)
    expect(requireValue(group.items[1]).comparisons).toHaveLength(3)
    expect(
      requireValue(group.items[1]).comparisons.every(
        (item) => item.state === "missing" && item.outcomes === null,
      ),
    ).toBe(true)
    expect(requireValue(requireValue(group.items[0]).comparisons[0]).outcomes?.visual).toBe(
      "passed",
    )
    expect(group.outcome).toBe("blocked")
    expect(group.scope.kind).toBe("staged")
    expect(result.capabilities.promoteReferences).toBe(false)
    expect(result.integration.state).toBe("provider-ready-ui-unavailable")
  })
  it("projects arbitrary dimensions and non-Figma sources with explicit image roles", () => {
    const result = projection()
    expect(result.project.id).toBe("independent-library")
    const item = requireValue(requireValue(result.families[0]).items[0])
    expect(item.dimensions).toEqual({ density: "compact", brand: "north", mode: "light" })
    const comparison = requireValue(item.comparisons[0])
    expect(comparison.sourceUrl).toBe("https://example.test/design-spec/compact")
    expect(comparison.artifacts[0]).toMatchObject({
      role: "reference",
      mimeType: "image/webp",
      sha256: "c".repeat(64),
    })
    expect(requireValue(comparison.artifacts[0]).href).toBe(
      "/api/artifact?run=run-one&path=opaque-name.webp",
    )
  })
  it("never borrows another mode or adapter image and never guesses legacy artifact roles", () => {
    const { catalog, report } = fixture()
    requireValue(report.cases[0]).mode = "dark"
    Reflect.deleteProperty(requireValue(requireValue(report.cases[0]).artifacts[0]), "role")
    const result = projectUIEvidence({
      project: { id: "x", label: "X" },
      catalog,
      reports: new Map([[report.runId, report]]),
    })
    expect(
      requireValue(requireValue(result.families[0]).items[0]).comparisons.every(
        (item) => !item.artifacts.length,
      ),
    ).toBe(true)
    requireValue(report.cases[0]).mode = "light"
    const legacy = projectUIEvidence({
      project: { id: "x", label: "X" },
      catalog,
      reports: new Map([[report.runId, report]]),
    })
    expect(
      requireValue(
        requireValue(requireValue(requireValue(legacy.families[0]).items[0]).comparisons[0])
          .artifacts[0],
      ).role,
    ).toBe("evidence")
  })
  it("rejects cross-run, cross-family and duplicate result identity", () => {
    const { catalog, report } = fixture()
    const project = { id: "x", label: "X" }
    report.family = "other"
    expect(() =>
      projectUIEvidence({ project, catalog, reports: new Map([["run-one", report]]) }),
    ).toThrow("identity")
    report.family = "control"
    report.runId = "older-run"
    expect(() =>
      projectUIEvidence({ project, catalog, reports: new Map([["run-one", report]]) }),
    ).toThrow("identity")
    report.runId = "run-one"
    report.cases.push(structuredClone(requireValue(report.cases[0])))
    expect(() =>
      projectUIEvidence({ project, catalog, reports: new Map([["run-one", report]]) }),
    ).toThrow("Duplicate")
  })
  it("surfaces core artifact/integrity rejection without falling back to historical evidence", async () => {
    const { catalog } = fixture()
    const reads: string[] = []
    const result = await createUIProvider("/unused", {
      getCatalog: () => catalog,
      readReport: (_root, id) => {
        reads.push(id)
        throw Error("Artifact missing or corrupted")
      },
    })
    expect(reads).toEqual(["run-one"])
    expect(result.publicInventory.requiredFamilies).toBe(32)
    expect(result.publicInventory.requiredValidationGroups).toBe(36)
    expect(result.publicInventory.scope).toBe("active")
    const input = requireValue(
      result.publicInventory.families.find((family) => family.family === "input"),
    )
    expect(input.validationGroups).toHaveLength(5)
    expect(
      input.validationGroups.every((group) =>
        result.families.some((entry) => entry.id === group.group),
      ),
    ).toBe(true)
    expect(requireValue(result.families[0]).error).toContain("corrupted")
    expect(requireValue(result.families[0]).run).toBe(null)
    expect(
      requireValue(requireValue(result.families[0]).items[0]).comparisons.every(
        (item) => !item.artifacts.length,
      ),
    ).toBe(true)
  })
  it("keeps unknown inventory distinct from zero required selections", () => {
    const result = projectUIEvidence({
      project: { id: "x", label: "X" },
      catalog: { families: [{ family: "not-enrolled" }] },
      reports: new Map(),
      implementations: [{ id: "custom-elements", label: "Custom elements" }],
    })
    expect(requireValue(result.implementations[0]).id).toBe("custom-elements")
    expect(requireValue(result.families[0]).inventory.requiredItems).toBeNull()
    expect(requireValue(result.families[0]).inventory.complete).toBe(false)
    expect(requireValue(result.families[0]).outcome).toBe("blocked")
  })
  it("does not imply Figma visual proof for a behavior obligation reusing a visual fixture", () => {
    const { catalog, report } = fixture()
    const item = requireValue(
      requireValue(requireValue(requireValue(catalog.families[0]).coverage).items)[0],
    )
    item.requiredProofs = ["behavior"]
    requireValue(report.cases[0]).measurements.push({
      part: "root",
      selector: "button",
      property: "bounds.width",
      expected: 80,
      actual: 80,
      delta: 0,
      tolerance: 0,
      outcome: "passed",
      source: { fileKey: "design", nodeId: "node", propertyPath: "width" },
    })
    requireValue(report.cases[0]).artifacts.push(
      { path: "actual.png", role: "actual", mimeType: "image/png", sha256: "d".repeat(64) },
      {
        path: "behavior.json",
        role: "behavior",
        mimeType: "application/json",
        sha256: "e".repeat(64),
      },
    )
    const projected = requireValue(
      requireValue(
        projectUIEvidence({
          project: { id: "x", label: "X" },
          catalog,
          reports: new Map([[report.runId, report]]),
        }).families[0],
      ).items[0],
    )
    expect(projected.visualRequired).toBe(false)
    expect(requireValue(projected.comparisons[0]).visualRequired).toBe(false)
    expect(
      requireValue(projected.comparisons[0]).artifacts.map((artifact) => artifact.role),
    ).toEqual(["behavior"])
    expect(requireValue(projected.comparisons[0]).measurements).toEqual([])
    expect(requireValue(projected.comparisons[0]).sourceUrl).toBeNull()
    // The immutable source report retains its separate visual selection evidence.
    expect(requireValue(report.cases[0]).artifacts).toHaveLength(3)
    expect(requireValue(report.cases[0]).measurements).toHaveLength(1)
  })
  it.each(["changed", "missing"] as const)(
    "rejects an exact-run comparison when its required definition is %s",
    (evidenceMatch) => {
      const { catalog, report } = fixture()
      requireValue(
        requireValue(requireValue(requireValue(catalog.families[0]).coverage).items)[0],
      ).evidenceMatch = evidenceMatch
      const comparison = requireValue(
        requireValue(
          requireValue(
            projectUIEvidence({
              project: { id: "x", label: "X" },
              catalog,
              reports: new Map([[report.runId, report]]),
            }).families[0],
          ).items[0],
        ).comparisons[0],
      )
      expect(comparison.state).toBe("unmatched")
      expect(comparison.outcomes).toBeNull()
      expect(comparison.measurements).toEqual([])
      expect(comparison.artifacts).toEqual([])
    },
  )
})
