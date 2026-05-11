/**
 * Vue Switch introduction docs guard — verifies that the
 * Introduction.mdx file documents all expected sections and component references.
 */
import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

describe("Vue switch introduction docs", () => {
  it("documents all switch layers", () => {
    const introPath = path.resolve(__dirname, "../Introduction.mdx")
    const introDoc = readFileSync(introPath, "utf8")

    const componentNames = [
      "Switch",
      "SwitchField",
      "FeatureToggle",
      "PreferenceSwitch",
      "PermissionSwitch",
    ]

    for (const componentName of componentNames) {
      expect(introDoc).toContain(componentName)
    }

    const sizeLabels = ["compact", "wide", "rich", "24×16", "30×16", "30×20"]

    for (const sizeLabel of sizeLabels) {
      expect(introDoc).toContain(sizeLabel)
    }
  })
})
