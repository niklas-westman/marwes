/**
 * Vue Accordion introduction docs guard — verifies that the
 * Introduction.mdx file documents all expected sections and component references.
 */
import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

describe("Vue accordion introduction docs", () => {
  it("documents all accordion layers", () => {
    const introPath = path.resolve(__dirname, "../Introduction.mdx")
    const introDoc = readFileSync(introPath, "utf8")

    const componentNames = [
      "Accordion",
      "AccordionField",
      "FAQAccordion",
      "SettingsAccordion",
      "SectionsAccordion",
    ]

    for (const componentName of componentNames) {
      expect(introDoc).toContain(componentName)
    }
  })
})
