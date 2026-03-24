import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

describe("Vue checkbox introduction docs", () => {
  it("documents atom and molecule layers", () => {
    const introPath = path.resolve(__dirname, "../Introduction.mdx")
    const introDoc = readFileSync(introPath, "utf8")

    expect(introDoc).toContain("Checkbox (Atom)")
    expect(introDoc).toContain("CheckboxField (Molecule)")
  })
})
