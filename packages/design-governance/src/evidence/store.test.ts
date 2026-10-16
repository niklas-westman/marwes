import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { afterEach, describe, expect, it } from "vitest"
import type { GovernanceReport } from "../contracts/report.js"
import { requireValue } from "../contracts/require-value.js"
import { proofInputFingerprint } from "../source-promotion/proof-inputs.js"
import { createPromotionStage } from "../source-promotion/stage.js"
import { getCatalog, hash, inputFingerprint, readReport, writeReport } from "./store.js"
const roots: string[] = []
afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true })
})
function fixture() {
  const root = mkdtempSync(join(tmpdir(), "governance-evidence-"))
  roots.push(root)
  mkdirSync(join(root, "packages/presets/src"), { recursive: true })
  writeFileSync(join(root, "packages/presets/src/styles.css"), "button {padding:16px}")
  return root
}
describe("inputFingerprint", () => {
  it("ignores the promotion lock so apply can re-validate after taking it", () => {
    const root = fixture()
    mkdirSync(join(root, "packages/design-governance/reflection-families/button"), {
      recursive: true,
    })
    const before = inputFingerprint(root)
    writeFileSync(
      join(
        root,
        "packages/design-governance/reflection-families/button/.governance-promotion.lock",
      ),
      "{}",
    )
    expect(inputFingerprint(root)).toBe(before)
    writeFileSync(
      join(root, "packages/design-governance/reflection-families/button/other.json"),
      "{}",
    )
    expect(inputFingerprint(root)).not.toBe(before)
  })
})
function run(root: string): GovernanceReport {
  return {
    schemaVersion: 1,
    runId: "button-run",
    family: "button",
    startedAt: "2026-10-14T00:00:00Z",
    finishedAt: "2026-10-14T00:00:01Z",
    fingerprint: inputFingerprint(root),
    environment: { browser: "test" },
    cases: [
      {
        caseId: "button.basic",
        adapter: "react",
        mode: "light",
        sourceUrl: "figma",
        measurements: [
          {
            part: "root",
            selector: "button",
            property: "bounds.width",
            expected: 66,
            actual: 66,
            delta: 0,
            tolerance: 0,
            source: { fileKey: "file", nodeId: "1:2", propertyPath: "width" },
            outcome: "passed",
          },
        ],
        outcomes: {
          integrity: "passed",
          structural: "passed",
          visual: "passed",
          coverage: "passed",
          behavior: "not-run",
        },
        unsupported: [],
        artifacts: [],
      },
    ],
    freshness: { state: "current", reasons: [] },
    review: { state: "unreviewed" },
    outcome: "passed",
  }
}
describe("immutable evidence", () => {
  for (const path of [
    "docs/registry/families/button/registry.meta.json",
    "artifacts/component-registry.json",
  ])
    it(`invalidates proof when authoritative requirements change in ${path}`, () => {
      const root = fixture()
      const file = join(root, path)
      mkdirSync(join(file, ".."), { recursive: true })
      writeFileSync(file, JSON.stringify({ requiredPurposes: ["save"] }))
      const report = run(root)
      writeReport(root, report)
      writeFileSync(file, JSON.stringify({ requiredPurposes: ["save", "delete"] }))
      const changed = readReport(root, report.runId)
      expect(changed.freshness.state).toBe("stale")
      expect(changed.outcome).toBe("blocked")
    })
  it("invalidates stored proof after shared CSS changes without rewriting history", () => {
    const root = fixture()
    const report = run(root)
    writeReport(root, report)
    writeFileSync(join(root, "packages/presets/src/styles.css"), "button {padding:30px}")
    expect(readReport(root, report.runId).freshness.state).toBe("stale")
    expect(readReport(root, report.runId).outcome).toBe("blocked")
    expect(() => writeReport(root, report)).toThrow("immutable")
  })
  it("never trusts accepted bits without a human-authored exact review record", () => {
    const root = fixture()
    const report = run(root)
    report.review.state = "accepted"
    writeReport(root, report)
    expect(readReport(root, report.runId).review.state).toBe("unreviewed")
  })
  it("rejects a corrupt artifact rather than silently selecting another run", () => {
    const root = fixture()
    const report = run(root)
    const directory = join(root, ".reflection/governance", report.runId)
    mkdirSync(directory, { recursive: true })
    writeFileSync(join(directory, "actual.png"), "original")
    const item = report.cases[0]
    if (!item) throw Error("Missing case")
    item.artifacts = [{ path: "actual.png", mimeType: "image/png", sha256: hash("original") }]
    writeReport(root, report)
    writeFileSync(join(directory, "actual.png"), "modified")
    expect(() => readReport(root, report.runId)).toThrow("corrupted")
  })
  it("catalog case outcomes retain failed visual proof alongside passed structure", () => {
    const root = fixture()
    const familyRoot = join(root, "packages/design-governance/reflection-families/button")
    mkdirSync(familyRoot, { recursive: true })
    writeFileSync(
      join(familyRoot, "reflection-contract.json"),
      JSON.stringify({ cases: [{ caseId: "button.basic", mode: "light" }] }),
    )
    const report = run(root)
    const entry = report.cases[0]
    if (!entry) throw Error("Missing case")
    entry.outcomes.visual = "failed"
    report.outcome = "failed"
    writeReport(root, report)
    const catalog = getCatalog(root)
    const row = catalog.families[0]?.cases[0]
    expect(row?.outcomes?.structural).toBe("passed")
    expect(row?.outcomes?.visual).toBe("failed")
    expect(row?.outcome).toBe("failed")
  })
  it("a corrupt historical artifact does not invalidate newer healthy proof, but a corrupt latest run blocks", () => {
    const root = fixture()
    const familyRoot = join(root, "packages/design-governance/reflection-families/button")
    mkdirSync(familyRoot, { recursive: true })
    writeFileSync(
      join(familyRoot, "reflection-contract.json"),
      JSON.stringify({ cases: [{ caseId: "button.basic", mode: "light" }] }),
    )
    const older = run(root)
    const oldDirectory = join(root, ".reflection/governance", older.runId)
    mkdirSync(oldDirectory, { recursive: true })
    writeFileSync(join(oldDirectory, "actual.png"), "old")
    const oldCase = older.cases[0]
    if (!oldCase) throw Error("Missing case")
    oldCase.artifacts = [{ path: "actual.png", sha256: hash("old"), mimeType: "image/png" }]
    writeReport(root, older)
    const newer = run(root)
    newer.runId = "button-newer"
    newer.finishedAt = "2026-10-14T00:01:00Z"
    writeReport(root, newer)
    writeFileSync(join(oldDirectory, "actual.png"), "corrupt")
    expect(getCatalog(root).families[0]?.runId).toBe("button-newer")
    expect(getCatalog(root).families[0]?.outcome).toBe("passed")
    expect(() => readReport(root, older.runId)).toThrow("corrupted")
    writeFileSync(join(root, ".reflection/governance", newer.runId, "report.json"), "invalid JSON")
    expect(getCatalog(root).families[0]?.freshness.state).toBe("invalid")
    expect(getCatalog(root).families[0]?.runId).toBe(null)
  })
  it("explicit catalog selection retains an older run and rejects corrupt or mismatched selections", () => {
    const root = fixture()
    const familyRoot = join(root, "packages/design-governance/reflection-families/button")
    mkdirSync(familyRoot, { recursive: true })
    writeFileSync(
      join(familyRoot, "reflection-contract.json"),
      JSON.stringify({ cases: [{ caseId: "button.basic", mode: "light" }] }),
    )
    const older = { ...run(root), runId: "button-1791936000000-old" }
    writeReport(root, older)
    const newer = {
      ...run(root),
      runId: "button-1791936060000-newer",
      finishedAt: "2026-10-14T00:01:00Z",
    }
    writeReport(root, newer)
    expect(getCatalog(root).families[0]?.runId).toBe(newer.runId)
    expect(getCatalog(root, { family: "button", runId: older.runId }).families[0]?.runId).toBe(
      older.runId,
    )
    expect(() => getCatalog(root, { family: "other", runId: older.runId })).toThrow(
      "family identity",
    )
    expect(() => getCatalog(root, { family: "button", runId: "missing-run" })).toThrow()
    writeFileSync(join(root, ".reflection/governance", older.runId, "report.json"), "corrupt")
    expect(() => getCatalog(root, { family: "button", runId: older.runId })).toThrow()
    expect(getCatalog(root).families[0]?.runId).toBe(newer.runId)
  })
  it("exact historical selection retains newly required missing inventory instead of borrowing newer evidence", () => {
    const root = fixture()
    const familyRoot = join(root, "packages/design-governance/reflection-families/button")
    mkdirSync(familyRoot, { recursive: true })
    writeFileSync(
      join(familyRoot, "reflection-contract.json"),
      JSON.stringify({ figmaFileKey: "file", cases: [{ caseId: "button.basic", mode: "light" }] }),
    )
    const basic = {
      itemId: "basic.light",
      label: "Basic",
      caseId: "button.basic",
      mode: "light",
      requiredProofs: ["visual"],
    }
    writeFileSync(
      join(familyRoot, "coverage-contract.json"),
      JSON.stringify({ schemaVersion: 1, family: "button", figmaFileKey: "file", items: [basic] }),
    )
    const older = run(root)
    writeReport(root, older)
    writeFileSync(
      join(familyRoot, "coverage-contract.json"),
      JSON.stringify({
        schemaVersion: 1,
        family: "button",
        figmaFileKey: "file",
        items: [
          basic,
          { itemId: "future.light", label: "Future", mode: "light", requiredProofs: ["visual"] },
        ],
      }),
    )
    const newer = { ...run(root), runId: "button-newer", finishedAt: "2026-10-14T00:01:00Z" }
    writeReport(root, newer)
    const selected = requireValue(
      getCatalog(root, { family: "button", runId: older.runId }).families[0],
    )
    expect(selected.runId).toBe(older.runId)
    expect(selected.freshness.state).toBe("stale")
    expect(selected.coverage.requiredItems).toBe(2)
    expect(selected.coverage.items?.find((item) => item.itemId === "future.light")?.gaps).toContain(
      "Runtime fixture not enrolled",
    )
    expect(selected.cases.every((item) => item.runId === null)).toBe(true)
  })
  it("a malformed older report does not invalidate an exact review of newer healthy evidence", () => {
    const root = fixture()
    const oldId = `button-${Date.parse("2026-10-14T00:00:00Z")}-old`
    const oldDirectory = join(root, ".reflection/governance", oldId)
    mkdirSync(oldDirectory, { recursive: true })
    writeFileSync(join(oldDirectory, "report.json"), "malformed historical report")
    const report = run(root)
    report.runId = `button-${Date.parse("2026-10-14T00:01:00Z")}-new`
    report.finishedAt = "2026-10-14T00:01:00Z"
    writeReport(root, report)
    const reviewDirectory = join(root, ".reflection/governance/reviews/button")
    mkdirSync(reviewDirectory, { recursive: true })
    const raw = readFileSync(
      join(root, ".reflection/governance", report.runId, "report.json"),
      "utf8",
    )
    writeFileSync(
      join(reviewDirectory, `${report.runId}.json`),
      JSON.stringify({
        schemaVersion: 1,
        reviewer: "Niklas",
        authoredAt: "2026-10-14T00:02:00Z",
        decision: "accepted",
        family: "button",
        runId: report.runId,
        evidenceHash: hash(raw),
        inputFingerprint: report.fingerprint,
        caseIds: ["button.basic:react:light"],
        exceptions: [],
      }),
    )
    expect(readReport(root, report.runId).review.state).toBe("accepted")
    expect(() => readReport(root, oldId)).toThrow()
  })
})

describe("complete staged proof input binding", () => {
  async function stagedRun() {
    const root = fixture()
    const report = run(root)
    const activeRoot = join(root, "packages/design-governance/reflection-families/button")
    mkdirSync(activeRoot, { recursive: true })
    const capture = join(root, "capture")
    mkdirSync(capture)
    writeFileSync(join(capture, "snapshot.json"), "{}")
    const stage = await createPromotionStage({
      family: "button",
      inputFingerprint: report.fingerprint,
      activeRoot,
      inputRoot: capture,
      stagesRoot: join(root, ".reflection/governance/stages"),
      artifacts: [
        { sourcePath: "snapshot.json", destination: "source/snapshot.json", kind: "source" },
      ],
    })
    const inputs = join(root, ".reflection/governance", report.runId, "inputs")
    const paths = [
      "packages/design-governance/reflection-families/button/structural-contract.json",
      "packages/design-governance/reflection-families/button/coverage-contract.json",
      "packages/design-governance/reflection-families/button/baselines/basic.png",
      "packages/design-governance/reflection-families/button/baselines/basic.meta.json",
      "docs/registry/families/button/registry.generated.json",
    ]
    for (const relative of paths) {
      const target = join(inputs, relative)
      mkdirSync(join(target, ".."), { recursive: true })
      writeFileSync(target, "original")
    }
    report.environment = {
      evidenceScope: "staged",
      stageId: stage.stage.stageId,
      stageHash: stage.stageHash,
      proofInputsSha256: proofInputFingerprint(inputs),
    }
    writeReport(root, report)
    return { root, report, inputs, paths }
  }
  it.each([0, 1, 2, 3, 4])("rejects tampering with any copied proof input (%s)", async (index) => {
    const { root, report, inputs, paths } = await stagedRun()
    expect(readReport(root, report.runId).freshness.state).toBe("current")
    writeFileSync(join(inputs, requireValue(paths[index])), "tampered")
    expect(() => readReport(root, report.runId)).toThrow("Staged proof inputs changed")
  })
  it("fails closed for historical staged reports without a complete input binding", async () => {
    const { root, report } = await stagedRun()
    Reflect.deleteProperty(report.environment, "proofInputsSha256")
    writeFileSync(
      join(root, ".reflection/governance", report.runId, "report.json"),
      JSON.stringify(report),
    )
    expect(() => readReport(root, report.runId)).toThrow("lacks a complete proof input binding")
  })
})

it("rejects omitting behavior required by the current coverage policy", () => {
  const root = fixture()
  const directory = join(root, "packages/design-governance/reflection-families/button")
  mkdirSync(directory, { recursive: true })
  writeFileSync(
    join(directory, "reflection-contract.json"),
    JSON.stringify({ cases: [{ caseId: "button.basic", mode: "light" }] }),
  )
  writeFileSync(
    join(directory, "coverage-contract.json"),
    JSON.stringify({
      items: [{ caseId: "button.basic", mode: "light", requiredProofs: ["behavior"] }],
    }),
  )
  const report = run(root)
  requireValue(report.cases[0]).requiredProofs = ["integrity", "structural", "visual", "coverage"]
  writeReport(root, report)
  expect(() => readReport(root, report.runId)).toThrow("required behavior policy")
})

it("binds behavior-only scope to registered sidecars and retains its required denominator", () => {
  const root = fixture()
  const directory = join(root, "packages/design-governance/reflection-families/button")
  mkdirSync(directory, { recursive: true })
  const entry = {
    caseId: "button.behavior-submit",
    mode: "light",
    portalPath: "/reflection/button/behavior-submit/light",
    viewportSize: { width: 390, height: 220 },
  }
  writeFileSync(join(directory, "reflection-contract.json"), JSON.stringify({ cases: [] }))
  writeFileSync(
    join(directory, "coverage-contract.json"),
    JSON.stringify({
      items: [{ caseId: entry.caseId, mode: entry.mode, requiredProofs: ["behavior"] }],
    }),
  )
  writeFileSync(
    join(directory, "behavior-fixtures.json"),
    JSON.stringify({ schemaVersion: 1, family: "button", cases: [entry] }),
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
          caseId: entry.caseId,
          mode: entry.mode,
          authority: { kind: "public-contract", reference: "Button submit" },
          steps: [{ kind: "disabled", selector: "button", expected: false }],
        },
      ],
    }),
  )
  const report = run(root)
  const item = requireValue(report.cases[0])
  Object.assign(item, {
    caseId: entry.caseId,
    proofScope: "behavior-only",
    sourceUrl: "",
    measurements: [],
    requiredProofs: ["integrity", "behavior", "coverage"],
    outcomes: {
      integrity: "passed",
      structural: "not-run",
      visual: "not-run",
      behavior: "unsupported",
      coverage: "passed",
    },
  })
  report.outcome = "blocked"
  writeReport(root, report)
  expect(requireValue(readReport(root, report.runId).cases[0]).proofScope).toBe("behavior-only")
  // The same identity must never be accepted as both a visual and behavior-only selection.
  writeFileSync(join(directory, "reflection-contract.json"), JSON.stringify({ cases: [entry] }))
  report.runId = "button-overlap"
  report.fingerprint = inputFingerprint(root)
  writeReport(root, report)
  expect(() => readReport(root, report.runId)).toThrow("overlaps a visual selection")
})

function latestEvidenceFixture() {
  const root = fixture()
  const directory = join(root, "packages/design-governance/reflection-families/button")
  mkdirSync(directory, { recursive: true })
  writeFileSync(
    join(directory, "reflection-contract.json"),
    JSON.stringify({ cases: [{ caseId: "button.basic", mode: "light" }] }),
  )
  const older = run(root)
  older.runId = `button-${Date.parse("2026-10-14T00:00:00Z")}-old`
  writeReport(root, older)
  const newer = {
    ...run(root),
    runId: `button-${Date.parse("2026-10-14T00:01:00Z")}-new`,
    finishedAt: "2026-10-14T00:01:00Z",
  }
  return { root, older, newer }
}
it("blocks when the latest report is deleted instead of reviving an older passing report", () => {
  const { root, newer } = latestEvidenceFixture()
  writeReport(root, newer)
  rmSync(join(root, ".reflection/governance", newer.runId, "report.json"))
  const family = requireValue(getCatalog(root).families[0])
  expect(family.runId).toBe(null)
  expect(family.freshness.state).toBe("invalid")
  expect(family.error).toContain("ENOENT")
  expect(family.cases.every((entry) => entry.outcomes === null && entry.runId === null)).toBe(true)
})
it("blocks an in-progress latest run before its report exists", () => {
  const { root, newer } = latestEvidenceFixture()
  mkdirSync(join(root, ".reflection/governance", newer.runId))
  const family = requireValue(getCatalog(root).families[0])
  expect(family.runId).toBe(null)
  expect(family.outcome).toBe("blocked")
  expect(family.freshness.state).toBe("invalid")
})
it("rejects a latest report claiming another family rather than skipping it", () => {
  const { root, newer } = latestEvidenceFixture()
  writeReport(root, { ...newer, family: "checkbox" })
  const family = requireValue(getCatalog(root).families[0])
  expect(family.runId).toBe(null)
  expect(family.freshness.state).toBe("invalid")
  expect(family.error).toContain("family differs")
})
it("still selects newer healthy evidence over an older malformed canonical run", () => {
  const { root, older, newer } = latestEvidenceFixture()
  writeFileSync(join(root, ".reflection/governance", older.runId, "report.json"), "malformed")
  writeReport(root, newer)
  const family = requireValue(getCatalog(root).families[0])
  expect(family.runId).toBe(newer.runId)
  expect(family.outcome).toBe("passed")
})
it("does not confuse a sibling family prefix with an in-progress run", () => {
  const { root, newer } = latestEvidenceFixture()
  mkdirSync(
    join(
      root,
      ".reflection/governance",
      `button-group-${Date.parse("2026-10-15T00:00:00Z")}-pending`,
    ),
  )
  writeReport(root, newer)
  expect(requireValue(getCatalog(root).families[0]).runId).toBe(newer.runId)
})
