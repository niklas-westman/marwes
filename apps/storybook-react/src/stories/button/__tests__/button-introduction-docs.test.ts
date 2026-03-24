import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

describe("React button introduction docs", () => {
  it("documents atom, variant, and purpose layers", () => {
    const introPath = path.resolve(__dirname, "../Introduction.mdx")
    const introDoc = readFileSync(introPath, "utf8")

    expect(introDoc).toContain("Button (Atom)")
    expect(introDoc).toContain("Variant Wrappers")
    expect(introDoc).toContain("Purpose Wrappers")

    const buttonNames = [
      "PrimaryButton",
      "SecondaryButton",
      "TextButton",
      "SubmitButton",
      "CancelButton",
      "CreateButton",
      "DangerButton",
      "LinkButton",
    ]

    for (const buttonName of buttonNames) {
      expect(introDoc).toContain(buttonName)
    }
  })
})
