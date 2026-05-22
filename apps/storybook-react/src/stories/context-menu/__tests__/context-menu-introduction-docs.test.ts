import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

describe("React context menu introduction docs", () => {
  it("documents ownership boundaries and item semantics", () => {
    const introPath = path.resolve(__dirname, "../Introduction.mdx")
    const introDoc = readFileSync(introPath, "utf8")

    for (const expected of [
      "ContextMenu",
      "parent code owns opening",
      "positioning",
      'role="menuitem"',
      "disabled items cannot trigger selection",
      "data-destructive",
      "@marwes-ui/react",
    ]) {
      expect(introDoc).toContain(expected)
    }
  })
})
