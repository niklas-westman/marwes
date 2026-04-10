import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

describe("React tooltip introduction docs", () => {
  it("documents the tooltip atom and molecule layers", () => {
    const introPath = path.resolve(__dirname, "../Introduction.mdx")
    const introDoc = readFileSync(introPath, "utf8")

    const componentNames = ["Tooltip", "TooltipGroup", "IconName.HelpCircle", "IconName.Info"]

    for (const componentName of componentNames) {
      expect(introDoc).toContain(componentName)
    }
  })
})
