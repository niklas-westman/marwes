/**
 * Svelte Stat Tile introduction docs guard — verifies that the
 * Introduction.mdx file documents expected sections and component references.
 */
import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

describe("Svelte stat tile introduction docs", () => {
  it("documents Figma source, tones, and accessibility", () => {
    const introDoc = readFileSync(path.resolve(__dirname, "../Introduction.mdx"), "utf8")

    for (const value of [
      "Stat Tile",
      "Figma source",
      "Anatomy",
      "Loading State",
      "StatTileSkeleton",
      "positive",
      "negative",
      "Accessibility",
      "article",
    ]) {
      expect(introDoc).toContain(value)
    }
  })
})
