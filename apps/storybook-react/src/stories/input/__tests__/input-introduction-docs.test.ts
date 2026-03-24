import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

describe("React input introduction docs", () => {
  it("documents atom, molecule, and purpose variants", () => {
    const introPath = path.resolve(__dirname, "../Introduction.mdx")
    const introDoc = readFileSync(introPath, "utf8")

    expect(introDoc).toContain("Input (Atom)")
    expect(introDoc).toContain("InputField (Molecule)")

    const variants = [
      "SearchField",
      "PasswordField",
      "EmailField",
      "PhoneField",
      "URLField",
      "CurrencyField",
    ]

    for (const variantName of variants) {
      expect(introDoc).toContain(variantName)
    }
  })
})
