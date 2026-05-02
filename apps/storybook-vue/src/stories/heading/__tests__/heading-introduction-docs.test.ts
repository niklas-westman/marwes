import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

describe("Vue heading introduction docs", () => {
  it("documents the heading atoms and usage guidance", () => {
    const introPath = path.resolve(__dirname, "../Introduction.mdx")
    const introDoc = readFileSync(introPath, "utf8")

    const expectedContent = [
      "Heading",
      "H1",
      "H2",
      "H3",
      "size",
      "Accessibility notes",
      "Choose the heading level by document outline first",
      "size` changes the visual scale, not the semantic level",
      "Do not use headings for decorative emphasis only",
      "ariaLabel` is rare for headings",
      "Component Reference",
    ]

    for (const value of expectedContent) {
      expect(introDoc).toContain(value)
    }
  })
})
