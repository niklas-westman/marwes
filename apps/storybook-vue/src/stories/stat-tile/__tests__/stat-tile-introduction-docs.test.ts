/**
 * Vue Stat Tile introduction docs guard — verifies that the
 * Introduction.mdx file documents all expected sections and component references.
 */
import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

describe("Vue stat tile introduction docs", () => {
  it("documents Figma source, tones, and accessibility", () => {
    const introDoc = readFileSync(path.resolve(__dirname, "../Introduction.mdx"), "utf8")

    for (const value of [
      "Stat Tile",
      "Figma source",
      "positive",
      "negative",
      "Accessibility",
      "article",
    ]) {
      expect(introDoc).toContain(value)
    }
  })
})
