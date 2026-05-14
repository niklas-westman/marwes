/**
 * Vue Icon introduction docs guard — verifies that the
 * Introduction.mdx file documents all expected sections and component references.
 */
import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

describe("Vue icon introduction docs", () => {
  it("documents the icon atom and usage guidance", () => {
    const introPath = path.resolve(__dirname, "../Introduction.mdx")
    const introDoc = readFileSync(introPath, "utf8")

    const expectedContent = [
      "Icon",
      "Icon (Atom)",
      "size",
      "strokeWidth",
      "Accessibility notes",
      "Icons are decorative by default",
      "Standalone icons need an accessible label",
      "Icon-only controls should usually be labelled on the parent control",
      "decorative={false}` is not enough on its own",
      "Component Reference",
    ]

    for (const value of expectedContent) {
      expect(introDoc).toContain(value)
    }
  })
})
