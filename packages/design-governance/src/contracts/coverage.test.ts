import { readFileSync, rmSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { afterEach, expect, it } from "vitest"
import { compileFamily } from "../compile/compile-family.js"
import { createOfflineProofFixture } from "../source/offline-test-fixture.js"
import type { LegacyContract } from "../source/types.js"
import { type CoverageContract, familyCoverage, validateCoverageContract } from "./coverage.js"
import { requireValue } from "./require-value.js"
const roots: string[] = []
afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { force: true, recursive: true })
})
function fixture() {
  const root = createOfflineProofFixture()
  rmSync(
    join(root, "packages/design-governance/reflection-families/button/behavior-fixtures.json"),
    { force: true },
  )
  roots.push(root)
  const directory = join(root, "packages/design-governance/reflection-families/button")
  const c: LegacyContract = JSON.parse(
    readFileSync(join(directory, "reflection-contract.json"), "utf8"),
  )
  const inventory: CoverageContract = {
    schemaVersion: 1,
    family: "button",
    figmaFileKey: c.figmaFileKey,
    items: c.cases.map((c) => ({
      itemId: `${c.caseId}.${c.mode}`,
      label: c.caseId,
      caseId: c.caseId,
      mode: c.mode,
      source: { nodeId: c.source.componentNodeId },
      requiredProofs: ["structural", "visual"],
    })),
  }
  const path = join(directory, "coverage-contract.json")
  writeFileSync(path, JSON.stringify(inventory))
  const compiled = compileFamily(root, "button")
  return { root, inventory, path, compiled }
}
it("keeps a missing required state in the denominator even when all registered properties pass", () => {
  const { root, inventory, path, compiled } = fixture()
  inventory.items.push({
    itemId: "required.hover.dark",
    label: "Dark hover",
    mode: "dark",
    requiredProofs: ["structural", "visual"],
  })
  writeFileSync(path, JSON.stringify(inventory))
  const result = familyCoverage(root, "button", compiled)
  const row = requireValue(result.items.find((i) => i.itemId === "required.hover.dark"))
  expect(row.gaps).toContain("Runtime fixture not enrolled")
  expect(result.complete).toBe(false)
  expect(result.requiredItems).toBeGreaterThan(compiled.cases.length)
})
it("cannot erase known public/source inventory gaps by declaring only a passing subset", () => {
  const { root, compiled } = fixture()
  const assessment = familyCoverage(root, "button", compiled)
  expect(assessment.complete).toBe(false)
  expect(assessment.items.some((i) => i.label.includes("hover"))).toBe(true)
})
it("rejects a source selection substituted for another case", () => {
  const { root, inventory, path, compiled } = fixture()
  requireValue(requireValue(inventory.items[0]).source).nodeId = "1:999"
  writeFileSync(path, JSON.stringify(inventory))
  expect(requireValue(familyCoverage(root, "button", compiled).items[0]).gaps).toContain(
    "Fixture selects a different Figma source node",
  )
})
it("keeps behavior requirements unsupported until governance captures that proof", () => {
  const { root, inventory, path, compiled } = fixture()
  rmSync(
    join(root, "packages/design-governance/reflection-families/button/behavior-contract.json"),
    { force: true },
  )
  requireValue(inventory.items[0]).requiredProofs.push("behavior")
  writeFileSync(path, JSON.stringify(inventory))
  expect(requireValue(familyCoverage(root, "button", compiled).items[0]).gaps).toContain(
    "Behavior contract not enrolled",
  )
})
it("recognizes exact declared behavior enrollment without substituting another mode", () => {
  const { root, inventory, path, compiled } = fixture()
  requireValue(inventory.items[0]).requiredProofs.push("behavior")
  writeFileSync(path, JSON.stringify(inventory))
  const item = requireValue(inventory.items[0])
  const behaviorPath = join(
    root,
    "packages/design-governance/reflection-families/button/behavior-contract.json",
  )
  writeFileSync(
    behaviorPath,
    JSON.stringify({
      schemaVersion: 1,
      family: "button",
      applicability: { kind: "interactive" },
      scenarios: [
        {
          id: "button.keyboard",
          caseId: item.caseId,
          mode: item.mode,
          authority: { kind: "public-contract", reference: "Button API" },
          steps: [{ kind: "disabled", selector: ".mw-btn", expected: false }],
        },
      ],
    }),
  )
  expect(
    requireValue(familyCoverage(root, "button", compiled).items[0]).gaps.some((gap) =>
      gap.startsWith("Behavior"),
    ),
  ).toBe(false)
})
it("rejects duplicate or malformed requirements", () => {
  const { inventory } = fixture()
  inventory.items.push(requireValue(inventory.items[0]))
  expect(() => validateCoverageContract(inventory)).toThrow("duplicate")
})

it("requires an explicit coverage inventory even when compilation reports no uncovered cases", () => {
  const { root, path, compiled } = fixture()
  rmSync(path)
  const assessment = familyCoverage(root, "button", {
    ...compiled,
    uncovered: [],
    uncoveredVariants: [],
  })
  expect(assessment.complete).toBe(false)
  expect(assessment.gaps).toContain("Required family coverage inventory not enrolled")
})

it("retains explicitly design-needed selections and every required proof without inventing a pass", () => {
  const { root, inventory, path, compiled } = fixture()
  inventory.items.push({
    itemId: "required.future.light",
    label: "Future design",
    mode: "light",
    source: {
      availability: "needs-design",
      reason: "No approved Figma treatment exists for this selection",
    },
    requiredProofs: ["structural", "visual", "behavior"],
  })
  writeFileSync(path, JSON.stringify(inventory))
  const result = familyCoverage(root, "button", compiled)
  const row = requireValue(result.items.find((item) => item.itemId === "required.future.light"))
  expect(row.source?.availability).toBe("needs-design")
  expect(row.requiredProofs).toEqual(["structural", "visual", "behavior"])
  expect(row.gaps).toContain("Design needed: No approved Figma treatment exists for this selection")
  expect(row.gaps).toContain("Runtime fixture not enrolled")
  expect(row.gaps.some((gap) => gap.startsWith("Behavior"))).toBe(true)
  expect(result.complete).toBe(false)
})

it("requires an explicit reason for design absence and rejects contradictory or unknown declarations", () => {
  const { inventory } = fixture()
  const requirement = requireValue(inventory.items[0])
  for (const source of [
    { availability: "needs-design" },
    { availability: "needs-design", reason: " " },
    { availability: "needs-design", nodeId: "1:2", reason: "Contradictory frame" },
    { availability: "rule-defined" },
    { availability: "unknown", reason: "Unknown status" },
  ]) {
    expect(() =>
      validateCoverageContract({ ...inventory, items: [{ ...requirement, source }] }),
    ).toThrow("coverage source")
  }
  expect(() =>
    validateCoverageContract({
      ...inventory,
      items: [
        {
          ...requirement,
          source: {
            availability: "rule-defined",
            reason: "Approved focus rule; enrollment still needed",
          },
        },
      ],
    }),
  ).not.toThrow()
})
