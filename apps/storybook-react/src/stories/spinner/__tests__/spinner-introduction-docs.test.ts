/**
 * React Spinner introduction docs guard — verifies that the
 * Introduction.mdx file documents all expected sections and component references.
 */
import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

describe("React spinner introduction docs", () => {
  it("documents the spinner atom and accessibility guidance", () => {
    const introPath = path.resolve(__dirname, "../Introduction.mdx")
    const introDoc = readFileSync(introPath, "utf8")

    const expectedContent = [
      "Spinner",
      "Spinner (Atom)",
      "variant",
      "decorative",
      "ariaLabel",
      "ButtonSpinner",
      "EmptyStateSpinner",
      "Component Reference",
      "Accessibility notes",
      "decorative={false}",
      "prefers-reduced-motion",
      "slows from 800ms to 1600ms",
      "Button loading",
    ]

    for (const value of expectedContent) {
      expect(introDoc).toContain(value)
    }
  })
})
