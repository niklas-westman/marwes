import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

describe("Vue paragraph introduction docs", () => {
  it("documents the paragraph atom and usage guidance", () => {
    const introPath = path.resolve(__dirname, "../Introduction.mdx")
    const introDoc = readFileSync(introPath, "utf8")

    const expectedContent = ["Paragraph", "Paragraph (Atom)", "size", "md", "Component Reference"]

    for (const value of expectedContent) {
      expect(introDoc).toContain(value)
    }
  })
})
