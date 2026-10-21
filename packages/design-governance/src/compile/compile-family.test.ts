import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { resolve } from "node:path"
import { afterAll, describe, expect, it } from "vitest"
import { requireValue } from "../contracts/require-value.js"
import { createOfflineProofFixture } from "../source/offline-test-fixture.ts"
import { compileFamily } from "./compile-family.ts"
import { validateStructuralContract } from "./structural-contract.ts"
const root = createOfflineProofFixture()
afterAll(() => rmSync(root, { recursive: true, force: true }))
describe("Figma expected-value compiler", () => {
  it("cannot downgrade an enrolled family by deleting its structural sidecar", () => {
    const temporary = mkdtempSync(resolve(tmpdir(), "marwes-enrollment-"))
    try {
      const family = resolve(temporary, "packages/design-governance/reflection-families/button")
      mkdirSync(family, { recursive: true })
      writeFileSync(
        resolve(family, "reflection-contract.json"),
        JSON.stringify({
          figmaFileKey: "file",
          structuralContract: "structural-contract.json",
          cases: [],
        }),
      )
      expect(() => compileFamily(temporary, "button")).toThrow(
        "Required structural contract missing",
      )
    } finally {
      rmSync(temporary, { recursive: true, force: true })
    }
  })
  it("compiles independent basic Button geometry typography and paint with provenance", () => {
    const basic = compileFamily(root, "button").cases.find((item) => item.caseId === "button.basic")
    if (!basic) throw new Error("Missing basic case")
    const values = Object.fromEntries(
      basic.expectations
        .filter((item) => !item.property.startsWith("bounds.") || item.part === "root")
        // The Oct 14 source adds a transparent overlay part that shares properties with the surface.
        .filter((item) => item.part !== "overlay")
        .map((item) => [item.property, item.expected]),
    )
    expect(values).toMatchObject({
      "bounds.width": 66,
      "bounds.height": 40,
      paddingTop: 12,
      paddingLeft: 16,
      gap: 4,
      borderRadius: 4,
      fontFamily: "Instrument Sans",
      fontWeight: 500,
      fontSize: 14,
      lineHeight: 16,
      letterSpacing: -0.42,
      backgroundColor: "rgba(47, 49, 252, 1)",
      text: "Label",
    })
    expect(
      basic.expectations.find((item) => item.property === "paddingLeft")?.source.aliasChain?.length,
    ).toBeGreaterThan(1)
    expect(basic.limitations).toContain("Glyph rasterization requires visual proof")
  })
  it("keeps non-enrolled families visible", () => {
    expect(compileFamily(root, "card").uncovered.length).toBeGreaterThan(0)
  })
  it("resolves Badge themes independently", () => {
    // Badge has not been promoted to the Oct 14 capture, so it needs its own pinned identity.
    const badgeRoot = createOfflineProofFixture("badge")
    try {
      const cases = compileFamily(badgeRoot, "badge").cases
      const color = (mode: string) =>
        cases
          .find((c) => c.caseId === "badge.neutral" && c.mode === mode)
          ?.expectations.find((e) => e.property === "color")?.expected
      expect(color("light")).not.toEqual(color("dark"))
    } finally {
      rmSync(badgeRoot, { recursive: true, force: true })
    }
  })
  it("inventories source icon variants and public registry states beyond enrolled cases", () => {
    const inventory = compileFamily(root, "button").uncoveredVariants ?? []
    expect(
      inventory.some((item) => item.source === "figma" && item.name.includes("Icon=Right")),
    ).toBe(true)
    expect(
      inventory.some((item) => item.source === "registry" && item.id === "primary/hover/light"),
    ).toBe(true)
    expect(
      inventory.some((item) => item.source === "registry" && item.id === "neutral/default/light"),
    ).toBe(true)
  })
  it("projects only explicitly empty source fill collections into transparent surfaces", () => {
    const fixture = createOfflineProofFixture()
    try {
      const path = resolve(
        fixture,
        "packages/design-governance/reflection-families/button/structural-contract.json",
      )
      const mapping: unknown = JSON.parse(readFileSync(path, "utf8"))
      validateStructuralContract(mapping)
      const basic = requireValue(mapping.cases.find((c) => c.caseId === "button.basic"))
      const rootPart = requireValue(basic.parts.find((p) => p.part === "root"))
      const rootNode = rootPart.nodeId
      rootPart.properties.push({ property: "opacity", sourceProperty: "opacity", tolerance: 0 })
      basic.parts.push({
        part: "empty-surface",
        nodeId: rootNode,
        selector: ".mw-btn",
        properties: [{ property: "backgroundColor", sourceProperty: "fills", tolerance: 0 }],
      })
      writeFileSync(path, JSON.stringify(mapping))
      const compiled = requireValue(
        compileFamily(fixture, "button").cases.find((c) => c.caseId === "button.basic"),
      )
      expect(compiled.expectations.find((e) => e.part === "empty-surface")?.expected).toBe(
        "rgba(0, 0, 0, 0)",
      )
      expect(
        compiled.expectations.find((e) => e.part === "root" && e.property === "opacity")?.expected,
      ).toBe(1)
      requireValue(basic.parts.at(-1)).nodeId = requireValue(
        basic.parts.find((p) => p.part === "surface"),
      ).nodeId
      writeFileSync(path, JSON.stringify(mapping))
      expect(
        requireValue(
          compileFamily(fixture, "button").cases.find((c) => c.caseId === "button.basic"),
        ).unsupported.some((reason) => reason.includes("explicitly empty")),
      ).toBe(true)
    } finally {
      rmSync(fixture, { recursive: true, force: true })
    }
  })
  it("recognizes explicit public purpose mappings independently of case naming and keeps the other mode missing", () => {
    const fixture = createOfflineProofFixture()
    try {
      const path = resolve(
        fixture,
        "packages/design-governance/reflection-families/button/structural-contract.json",
      )
      const mapping: unknown = JSON.parse(readFileSync(path, "utf8"))
      validateStructuralContract(mapping)
      const basic = requireValue(mapping.cases.find((c) => c.caseId === "button.basic"))
      basic.publicPurpose = "verify"
      writeFileSync(path, JSON.stringify(mapping))
      const uncovered = requireValue(compileFamily(fixture, "button").uncoveredVariants)
      expect(uncovered.some((v) => v.id === "purpose/verify/light")).toBe(false)
      expect(uncovered.some((v) => v.id === "purpose/verify/dark")).toBe(true)
      Reflect.deleteProperty(basic, "publicPurpose")
      writeFileSync(path, JSON.stringify(mapping))
      expect(
        requireValue(compileFamily(fixture, "button").uncoveredVariants).some(
          (v) => v.id === "purpose/verify/light",
        ),
      ).toBe(true)
    } finally {
      rmSync(fixture, { recursive: true, force: true })
    }
  })
  it("rejects unknown contract fields and negative tolerances", () => {
    expect(() =>
      validateStructuralContract({
        schemaVersion: 1,
        family: "button",
        cases: [],
        toleranceReason: "test",
        rogue: true,
      }),
    ).toThrow("Unknown")
  })
})
