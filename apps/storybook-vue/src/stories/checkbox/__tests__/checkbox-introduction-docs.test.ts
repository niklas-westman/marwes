/**
 * Vue Checkbox introduction docs guard — verifies that the
 * Introduction.mdx file documents all expected sections and component references.
 */
import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

describe("Vue checkbox introduction docs", () => {
  it("documents public fields and keeps the atom internal", () => {
    const introPath = path.resolve(__dirname, "../Introduction.mdx")
    const introDoc = readFileSync(introPath, "utf8")

    expect(introDoc).toContain("Checkbox (Atom, internal)")
    expect(introDoc).toContain("CheckboxField (Molecule)")
    expect(introDoc).toContain("CheckboxGroupField (Molecule)")
    expect(introDoc).not.toContain('import { Checkbox } from "@marwes-ui/vue"')
  })
})
