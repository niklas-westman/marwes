import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

describe("Vue text introduction docs", () => {
  it("documents variants and semantic usage guidance", () => {
    const introPath = path.resolve(__dirname, "../Introduction.mdx")
    const introDoc = readFileSync(introPath, "utf8")

    for (const value of [
      "Text",
      "label",
      "label-small",
      "caption",
      "overline",
      "micro",
      "Accessibility Notes",
      "Choose semantics separately from visual style",
      "Component Reference",
    ]) {
      expect(introDoc).toContain(value)
    }
  })
})
