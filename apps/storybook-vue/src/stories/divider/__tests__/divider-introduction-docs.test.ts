import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

describe("Vue divider introduction docs", () => {
  it("documents the divider atom and usage guidance", () => {
    const introPath = path.resolve(__dirname, "../Introduction.mdx")
    const introDoc = readFileSync(introPath, "utf8")

    const expectedContent = [
      "Divider",
      "Divider (Atom)",
      "size",
      "orientation",
      "Accessibility notes",
      "Do not use Divider as a spacing helper",
      "Vertical dividers depend on container layout",
      "Divider is unlabeled",
      "Component Reference",
    ]

    for (const value of expectedContent) {
      expect(introDoc).toContain(value)
    }
  })
})
