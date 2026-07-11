import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

describe("React skip-link introduction docs", () => {
  it("documents usage and accessibility expectations", () => {
    const introDoc = readFileSync(path.resolve(__dirname, "../Introduction.mdx"), "utf8")

    for (const value of [
      "SkipLink",
      "Skip to main content",
      "keyboard focus",
      "target landmark",
      "Accessibility",
    ]) {
      expect(introDoc).toContain(value)
    }
  })
})
