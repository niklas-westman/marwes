import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

describe("React switch introduction docs", () => {
  it("documents atom, molecule, and purpose components", () => {
    const introPath = path.resolve(__dirname, "../Introduction.mdx")
    const introDoc = readFileSync(introPath, "utf8")

    expect(introDoc).toContain("Switch (Atom)")
    expect(introDoc).toContain("SwitchField (Molecule)")

    const variants = ["FeatureToggle", "PreferenceSwitch", "PermissionSwitch"]

    for (const variantName of variants) {
      expect(introDoc).toContain(variantName)
    }
  })
})
