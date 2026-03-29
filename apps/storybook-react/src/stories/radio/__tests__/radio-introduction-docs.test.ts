import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

describe("React radio introduction docs", () => {
  it("documents atom, molecule, and purpose components", () => {
    const introPath = path.resolve(__dirname, "../Introduction.mdx")
    const introDoc = readFileSync(introPath, "utf8")

    expect(introDoc).toContain("Radio (Atom)")
    expect(introDoc).toContain("RadioGroupField (Molecule)")

    const variants = ["YesNoRadioGroup", "RatingRadioGroup", "OptionRadioGroup"]

    for (const variantName of variants) {
      expect(introDoc).toContain(variantName)
    }
  })
})
