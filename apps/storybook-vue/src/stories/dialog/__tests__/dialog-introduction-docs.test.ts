/**
 * Vue Dialog introduction docs guard — verifies that the
 * Introduction.mdx file documents all expected sections and component references.
 */
import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

describe("Vue dialog introduction docs", () => {
  it("documents all dialog layers", () => {
    const introPath = path.resolve(__dirname, "../Introduction.mdx")
    const introDoc = readFileSync(introPath, "utf8")

    const componentNames = [
      "Dialog",
      "DialogModal",
      "ConfirmDialog",
      "DestructiveDialog",
      "InfoDialog",
      "dialogWhyPurposeComponents",
      "dialogPurposeComponentReference",
      "non-modal shell",
      "pass `modal` intentionally",
      "aria-modal",
      "Initial focus policy",
    ]

    for (const componentName of componentNames) {
      expect(introDoc).toContain(componentName)
    }
  })
})
