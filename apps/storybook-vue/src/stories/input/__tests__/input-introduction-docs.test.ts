/**
 * Vue Input introduction docs guard — verifies that the
 * Introduction.mdx file documents all expected sections and component references.
 */
import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

describe("Vue input introduction docs", () => {
  it("documents atom, molecule, and purpose variants", () => {
    const introPath = path.resolve(__dirname, "../Introduction.mdx")
    const introDoc = readFileSync(introPath, "utf8")

    expect(introDoc).toContain("## Atom: Input")
    expect(introDoc).toContain("## Atom: Select")
    expect(introDoc).toContain("## Atom: Textarea")
    expect(introDoc).toContain("## Atom: RichText")
    expect(introDoc).toContain("## Molecule: InputField")
    expect(introDoc).toContain("## Molecule: SelectField")
    expect(introDoc).toContain("## Molecule: TextareaField")
    expect(introDoc).toContain("## Molecule: RichTextField")

    const variants = [
      "DropdownField",
      "SearchField",
      "PasswordField",
      "EmailField",
      "DateOfBirthField",
      "ZipCodeField",
      "PhoneField",
      "URLField",
      "CurrencyField",
    ]

    for (const variantName of variants) {
      expect(introDoc).toContain(variantName)
    }
  })
})
