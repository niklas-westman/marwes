import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

describe("Vue context menu introduction docs", () => {
  it("documents ownership boundaries and item semantics", () => {
    const introPath = path.resolve(__dirname, "../Introduction.mdx")
    const introDoc = readFileSync(introPath, "utf8")

    for (const expected of [
      "ContextMenu",
      "Parent code owns",
      "positioning",
      'role="menuitem"',
      "disabled items cannot trigger selection",
      "data-destructive",
      "@marwes-ui/vue",
    ]) {
      expect(introDoc).toContain(expected)
    }
  })
})
