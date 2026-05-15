/**
 * Svelte Radio introduction docs guard — verifies that the Introduction.mdx file
 * documents the same atom, molecule, and purpose component layers as React/Vue.
 */
import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

describe("Svelte radio introduction docs", () => {
  it("documents atom, molecule, and purpose components", () => {
    const introPath = path.resolve(__dirname, "../Introduction.mdx")
    const introDoc = readFileSync(introPath, "utf8")

    expect(introDoc).toContain("Radio (Atom)")
    expect(introDoc).toContain("RadioGroupField")

    for (const variantName of ["YesNoRadioGroup", "RatingRadioGroup", "OptionRadioGroup"]) {
      expect(introDoc).toContain(variantName)
    }
  })
})
