/**
 * React Skeleton introduction docs guard — verifies that the
 * Introduction.mdx file documents all expected sections and component references.
 */
import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

describe("React skeleton introduction docs", () => {
  it("documents the skeleton atom and accessibility guidance", () => {
    const introPath = path.resolve(__dirname, "../Introduction.mdx")
    const introDoc = readFileSync(introPath, "utf8")

    const expectedContent = [
      "Skeleton",
      "low-level placeholder atom",
      "text",
      "circular",
      "rectangular",
      "Molecule Replicas",
      "CardSkeleton",
      "StatTileSkeleton",
      "InputFieldSkeleton",
      "ariaLabel",
      "Accessibility",
      "decorative by default",
    ]

    for (const value of expectedContent) {
      expect(introDoc).toContain(value)
    }
  })
})
