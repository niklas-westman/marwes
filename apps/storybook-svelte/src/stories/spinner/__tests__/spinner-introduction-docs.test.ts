/**
 * Svelte Spinner introduction docs guard — verifies that the
 * Introduction.mdx file documents expected sections and component references.
 */
import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

describe("Svelte spinner introduction docs", () => {
  it("documents the spinner atom, purpose components, and button loading usage", () => {
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
      "Accessibility Notes",
      "decorative={false}",
      "prefers-reduced-motion",
      "Button loading",
      '<Button variant="secondary" disabled>',
    ]

    for (const value of expectedContent) {
      expect(introDoc).toContain(value)
    }
  })
})
