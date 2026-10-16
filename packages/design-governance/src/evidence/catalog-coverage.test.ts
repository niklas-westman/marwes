import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { afterEach, expect, it, vi } from "vitest"
import { requireValue } from "../contracts/require-value.js"
vi.mock("../compile/compile-family.js", () => ({
  compileFamily: (_root: string, family: string) => ({
    family,
    cases: [],
    uncovered: [],
    uncoveredVariants: [],
  }),
}))
import type { CaseReport, GovernanceReport } from "../contracts/report.js"
import { proofInputFingerprint } from "../source-promotion/proof-inputs.js"
import { createPromotionStage } from "../source-promotion/stage.js"
import { getCatalog, hash, inputFingerprint, writeReport } from "./store.js"
const roots: string[] = []
afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true })
})
const familyPath = "packages/design-governance/reflection-families/button"
function fixture() {
  const root = mkdtempSync(join(tmpdir(), "current-catalog-"))
  roots.push(root)
  return root
}
function json(root: string, file: string, value: unknown) {
  const path = join(root, file)
  mkdirSync(join(path, ".."), { recursive: true })
  writeFileSync(path, JSON.stringify(value))
}
const forms = ["submit", "reset"].flatMap((feature) =>
  ["light", "dark"].map((mode) => ({
    caseId: `button.behavior-${feature}`,
    mode,
    portalPath: `/reflection/button/behavior-${feature}/${mode}`,
    viewportSize: { width: 390, height: 220 },
  })),
)
const scenarios = forms.map((entry) => ({
  id: `${entry.caseId}.${entry.mode}`,
  caseId: entry.caseId,
  mode: entry.mode,
  authority: { kind: "public-contract", reference: "Button form contract" },
  observations: [],
  steps: [{ kind: "disabled", selector: "button", expected: false }],
}))
function enrollForms(root: string) {
  json(root, `${familyPath}/behavior-fixtures.json`, {
    schemaVersion: 1,
    family: "button",
    cases: forms,
  })
  json(root, `${familyPath}/behavior-contract.json`, {
    schemaVersion: 1,
    family: "button",
    applicability: { kind: "interactive" },
    scenarios,
  })
}
function report(root: string, cases: CaseReport[]): GovernanceReport {
  return {
    schemaVersion: 1,
    runId: "button-old",
    family: "button",
    startedAt: "2026-10-14T00:00:00Z",
    finishedAt: "2026-10-14T00:00:01Z",
    fingerprint: inputFingerprint(root),
    environment: {},
    cases,
    freshness: { state: "current", reasons: [] },
    review: { state: "unreviewed" },
    outcome: "passed",
  }
}
const visual: CaseReport = {
  caseId: "button.basic",
  mode: "light",
  adapter: "react",
  sourceUrl: "figma",
  measurements: [],
  requiredProofs: ["integrity", "visual", "coverage"],
  outcomes: {
    integrity: "passed",
    visual: "passed",
    structural: "not-run",
    behavior: "not-run",
    coverage: "passed",
  },
  unsupported: [],
  artifacts: [],
}

it("retains 229 current requirements when exact staged evidence contains only 217", async () => {
  const root = fixture()
  const contract = {
    figmaFileKey: "file",
    cases: [
      {
        caseId: "button.basic",
        mode: "light",
        source: { componentNodeId: "1:2" },
        baseline: "button-basic.png",
      },
    ],
  }
  const oldItems = Array.from({ length: 217 }, (_, index) => ({
    itemId: `design.item.${index}`,
    label: `Design ${index}`,
    mode: "light",
    caseId: "button.basic",
    source: { nodeId: "1:2" },
    requiredProofs: ["visual"],
  }))
  json(root, `${familyPath}/reflection-contract.json`, contract)
  json(root, `${familyPath}/coverage-contract.json`, {
    schemaVersion: 1,
    family: "button",
    figmaFileKey: "file",
    items: oldItems,
  })
  const old = report(root, [visual])
  json(root, "capture/snapshot.json", {})
  const stage = await createPromotionStage({
    family: "button",
    inputFingerprint: old.fingerprint,
    activeRoot: join(root, familyPath),
    inputRoot: join(root, "capture"),
    stagesRoot: join(root, ".reflection/governance/stages"),
    artifacts: [
      { sourcePath: "snapshot.json", destination: "source/snapshot.json", kind: "source" },
    ],
  })
  const inputs = join(root, ".reflection/governance", old.runId, "inputs")
  json(inputs, `${familyPath}/reflection-contract.json`, {
    ...contract,
    cases: [{ ...contract.cases[0], baseline: "button-basic.webp" }],
  })
  json(inputs, `${familyPath}/coverage-contract.json`, {
    schemaVersion: 1,
    family: "button",
    figmaFileKey: "file",
    items: oldItems,
  })
  json(inputs, `${familyPath}/source/snapshot.json`, {})
  json(inputs, `${familyPath}/source/manifest.json`, {})
  old.environment = {
    evidenceScope: "staged",
    stageId: stage.stage.stageId,
    stageHash: stage.stageHash,
    proofInputsSha256: proofInputFingerprint(inputs),
    proofSnapshotSha256: hash(readFileSync(join(inputs, familyPath, "source/snapshot.json"))),
    proofManifestSha256: hash(readFileSync(join(inputs, familyPath, "source/manifest.json"))),
  }
  writeReport(root, old)
  enrollForms(root)
  const added = Array.from({ length: 12 }, (_, index) => ({
    itemId: `public.form.${index}`,
    label: "Form",
    mode: requireValue(forms[index % 4]).mode,
    caseId: requireValue(forms[index % 4]).caseId,
    requiredProofs: ["behavior"],
  }))
  json(root, `${familyPath}/coverage-contract.json`, {
    schemaVersion: 1,
    family: "button",
    figmaFileKey: "file",
    items: [...oldItems, ...added],
  })
  const family = requireValue(getCatalog(root).families[0])
  expect(family.coverage.requiredItems).toBe(229)
  expect(family.coverage.items).toHaveLength(229)
  expect(family.coverage.proofItems).toHaveLength(217)
  expect(family.coverage.items?.[0]?.evidenceMatch).toBe("matched")
  expect(family.coverage.items?.at(-1)?.evidenceMatch).toBe("missing")
  expect(family.cases.filter((entry) => entry.proofScope === "behavior-only")).toHaveLength(12)
  expect(
    family.cases
      .filter((entry) => entry.proofScope === "behavior-only")
      .every((entry) => entry.runId === null),
  ).toBe(true)
  json(root, `${familyPath}/reflection-contract.json`, {
    ...contract,
    cases: [{ ...contract.cases[0], baseline: "unrelated-reference.png" }],
  })
  expect(requireValue(getCatalog(root).families[0]).coverage.items?.[0]?.evidenceMatch).toBe(
    "changed",
  )
  json(root, `${familyPath}/reflection-contract.json`, {
    ...contract,
    cases: [{ ...contract.cases[0], portalPath: "/reflection/button/changed/light" }],
  })
  expect(requireValue(getCatalog(root).families[0]).coverage.items?.[0]?.evidenceMatch).toBe(
    "changed",
  )
  json(root, `${familyPath}/reflection-contract.json`, contract)
  requireValue(oldItems[0]).source.nodeId = "9:9"
  json(root, `${familyPath}/coverage-contract.json`, {
    schemaVersion: 1,
    family: "button",
    figmaFileKey: "file",
    items: [...oldItems, ...added],
  })
  expect(requireValue(getCatalog(root).families[0]).coverage.items?.[0]?.evidenceMatch).toBe(
    "changed",
  )
  json(root, ".reflection/governance/button-newest/report.json", {
    runId: "button-newest",
    finishedAt: "2026-10-15T00:00:00Z",
    malformed: true,
  })
  const invalid = requireValue(getCatalog(root).families[0])
  expect(invalid.coverage.requiredItems).toBe(229)
  expect(invalid.runId).toBe(null)
  expect(invalid.coverage.items?.every((item) => item.evidenceMatch === "missing")).toBe(true)
})

it("projects all four registered form cases across adapters and rejects visual scope substitution", () => {
  const root = fixture()
  json(root, `${familyPath}/reflection-contract.json`, { figmaFileKey: "file", cases: [] })
  enrollForms(root)
  json(root, `${familyPath}/coverage-contract.json`, {
    schemaVersion: 1,
    family: "button",
    figmaFileKey: "file",
    items: forms.map((entry, index) => ({
      itemId: `public.form.${index}`,
      label: "Form",
      mode: entry.mode,
      caseId: entry.caseId,
      requiredProofs: ["behavior"],
    })),
  })
  const current = report(root, [])
  current.runId = "button-forms"
  current.cases = forms.flatMap((entry, index) =>
    (["react", "vue", "svelte"] as const).map((adapter) => {
      const path = `${adapter}-${entry.caseId}-${entry.mode}-behavior.json`
      const bytes = JSON.stringify({
        schemaVersion: 1,
        runId: current.runId,
        fingerprint: current.fingerprint,
        family: "button",
        caseId: entry.caseId,
        mode: entry.mode,
        adapter,
        scenarios: [scenarios[index]],
        results: [
          {
            scenarioId: requireValue(scenarios[index]).id,
            outcome: "passed",
            steps: [{ index: 0, kind: "disabled", outcome: "passed" }],
          },
        ],
      })
      const destination = join(root, ".reflection/governance", current.runId, path)
      mkdirSync(join(destination, ".."), { recursive: true })
      writeFileSync(destination, bytes)
      return {
        ...visual,
        caseId: entry.caseId,
        mode: entry.mode,
        adapter,
        proofScope: "behavior-only" as const,
        sourceUrl: "",
        requiredProofs: ["integrity", "behavior", "coverage"],
        outcomes: {
          integrity: "passed",
          structural: "not-run",
          visual: "not-run",
          behavior: "passed",
          coverage: "passed",
        },
        artifacts: [{ path, sha256: hash(bytes), mimeType: "application/json", role: "behavior" }],
      } as CaseReport
    }),
  )
  writeReport(root, current)
  const family = requireValue(getCatalog(root).families[0])
  expect(family.cases).toHaveLength(12)
  expect(
    family.cases.every(
      (entry) =>
        entry.proofScope === "behavior-only" &&
        entry.outcomes?.behavior === "passed" &&
        entry.runId === current.runId,
    ),
  ).toBe(true)
  const malformed = {
    ...current,
    runId: "button-forged",
    finishedAt: "2026-10-15T00:00:00Z",
    cases: current.cases.map((entry) => ({
      ...visual,
      caseId: entry.caseId,
      mode: entry.mode,
      adapter: entry.adapter,
    })),
  }
  writeReport(root, malformed)
  const invalid = requireValue(getCatalog(root).families[0])
  expect(invalid.runId).toBe(null)
  expect(invalid.error).toContain("proof scope")
})
