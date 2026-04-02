import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

describe("React dialog introduction docs", () => {
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
    ]

    for (const componentName of componentNames) {
      expect(introDoc).toContain(componentName)
    }
  })
})
