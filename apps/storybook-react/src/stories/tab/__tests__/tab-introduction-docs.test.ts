import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

describe("React tab introduction docs", () => {
  it("documents all tab layers", () => {
    const introPath = path.resolve(__dirname, "../Introduction.mdx")
    const introDoc = readFileSync(introPath, "utf8")

    const componentNames = [
      "Tab",
      "TabGroup",
      "TabPanel",
      "NavigationTabs",
      "ContentTabs",
      "SettingsTabs",
      "tabWhyPurposeComponents",
      "tabPurposeComponentReference",
    ]

    for (const componentName of componentNames) {
      expect(introDoc).toContain(componentName)
    }
  })
})
