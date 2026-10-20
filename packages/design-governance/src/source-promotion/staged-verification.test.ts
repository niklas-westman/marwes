import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { afterEach, expect, it, vi } from "vitest"
import { requireValue } from "../contracts/require-value.js"

const mocks = vi.hoisted(() => ({ writeReport: vi.fn(), measure: vi.fn(), runBehavior: vi.fn() }))
vi.mock("../evidence/store.js", () => ({
  evidenceRoot: (root: string) => join(root, ".reflection/governance"),
  inputFingerprint: () => "a".repeat(64),
  hash: () => "b".repeat(64),
  writeReport: mocks.writeReport,
}))
vi.mock("../compile/compile-family.js", () => ({
  compileFamily: () => ({
    family: "button",
    uncovered: [],
    cases: [
      {
        caseId: "button.basic",
        mode: "light",
        portalPath: "/button",
        viewportSize: { width: 10, height: 10 },
        unsupported: [],
        expectations: [
          {
            part: "button",
            selector: "button",
            property: "height",
            expected: 36,
            tolerance: 0,
            source: { fileKey: "file", nodeId: "1:2", propertyPath: "height" },
          },
        ],
      },
    ],
  }),
}))
vi.mock("../contracts/coverage.js", () => ({
  familyCoverage: () => ({
    items: [],
    complete: false,
    gaps: ["Dark disabled variant has no fixture"],
  }),
}))
vi.mock("../contracts/enrollment.js", () => ({ structuralEnrollmentRequired: () => true }))
vi.mock("../source/portable-integrity.js", () => ({
  validatePortableIntegrity: () => ({ status: "passed", details: [] }),
}))
vi.mock("../runtime/behavior.js", async (original) => ({
  ...(await original<typeof import("../runtime/behavior.js")>()),
  runBehavior: mocks.runBehavior,
}))
vi.mock("../runtime/measure.js", () => ({ measure: mocks.measure, measureFonts: async () => [] }))
vi.mock("../runtime/portal.js", () => ({
  startPortal: async () => ({ url: "http://fixture", close: async () => {} }),
}))
vi.mock("../runtime/visual.js", () => ({
  runVisual: async () => ({
    directory: "/missing-fixture-images",
    outcomes: new Map([["visual.react.button.basic.light", "passed"]]),
  }),
}))
vi.mock("playwright", () => ({
  chromium: {
    launch: async () => ({
      version: () => "fixture",
      close: async () => {},
      newPage: async () => ({
        goto: async () => {},
        waitForFunction: async () => {},
        evaluate: async () => undefined,
        screenshot: async ({ path }: { path: string }) => writeFileSync(path, "image"),
        close: async () => {},
      }),
    }),
  },
}))
import { verifyFamily } from "../runtime/verify.js"
const roots: string[] = []
afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true })
  vi.clearAllMocks()
})
it("keeps missing required family coverage blocked after every registered measurement and image comparison passes", async () => {
  const root = mkdtempSync(join(tmpdir(), "coverage-gate-"))
  roots.push(root)
  const contractRoot = join(root, "packages/design-governance/reflection-families/button")
  mkdirSync(contractRoot, { recursive: true })
  mkdirSync(join(root, "node_modules/reflection-check"), { recursive: true })
  writeFileSync(join(root, "node_modules/reflection-check/package.json"), '{"version":"0.3.0"}')
  writeFileSync(
    join(contractRoot, "reflection-contract.json"),
    JSON.stringify({ cases: [{ caseId: "button.basic", mode: "light" }] }),
  )
  mocks.measure.mockResolvedValue([{ outcome: "passed" }])
  const report = await verifyFamily(root, { family: "button", adapters: ["react"] })
  expect(report.cases[0]?.outcomes.structural).toBe("passed")
  expect(report.cases[0]?.outcomes.visual).toBe("passed")
  expect(report.cases[0]?.outcomes.coverage).toBe("unsupported")
  expect(report.cases[0]?.unsupported).toContain(
    "Family coverage: Dark disabled variant has no fixture",
  )
  expect(report.outcome).toBe("blocked")
  expect(report.environment.evidenceScope).toBe("active")
})

it("executes behavior-only fixtures without manufacturing structural or visual evidence", async () => {
  const root = mkdtempSync(join(tmpdir(), "behavior-only-gate-"))
  roots.push(root)
  const directory = join(root, "packages/design-governance/reflection-families/button")
  mkdirSync(directory, { recursive: true })
  mkdirSync(join(root, "node_modules/reflection-check"), { recursive: true })
  writeFileSync(join(root, "node_modules/reflection-check/package.json"), '{"version":"0.4.0"}')
  writeFileSync(
    join(directory, "reflection-contract.json"),
    JSON.stringify({ cases: [{ caseId: "button.basic", mode: "light" }] }),
  )
  const fixture = {
    caseId: "button.behavior-submit",
    mode: "light",
    portalPath: "/reflection/button/behavior-submit/light",
    viewportSize: { width: 390, height: 220 },
  }
  writeFileSync(
    join(directory, "behavior-fixtures.json"),
    JSON.stringify({ schemaVersion: 1, family: "button", cases: [fixture] }),
  )
  writeFileSync(
    join(directory, "behavior-contract.json"),
    JSON.stringify({
      schemaVersion: 1,
      family: "button",
      applicability: { kind: "interactive" },
      scenarios: [
        {
          id: "submit.form",
          caseId: fixture.caseId,
          mode: fixture.mode,
          authority: { kind: "public-contract", reference: "Button submit" },
          steps: [{ kind: "disabled", selector: "button", expected: false }],
        },
      ],
    }),
  )
  mocks.measure.mockResolvedValue([{ outcome: "passed" }])
  mocks.runBehavior.mockResolvedValue([
    {
      scenarioId: "submit.form",
      outcome: "passed",
      steps: [{ index: 0, kind: "disabled", outcome: "passed" }],
    },
  ])
  const report = await verifyFamily(root, { family: "button", adapters: ["react"] })
  const item = requireValue(
    report.cases.find((item) => item.caseId === fixture.caseId),
    "Required staged-verification.test value",
  )
  expect(item.proofScope).toBe("behavior-only")
  expect(item.requiredProofs).toEqual(["integrity", "coverage", "behavior"])
  expect(item.outcomes.behavior).toBe("passed")
  expect(item.outcomes.structural).toBe("not-run")
  expect(item.outcomes.visual).toBe("not-run")
  expect(item.artifacts).toHaveLength(1)
  expect(item.artifacts[0]?.role).toBe("behavior")
  expect(mocks.measure).toHaveBeenCalledTimes(1)
})
