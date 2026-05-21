/**
 * Vue Drawer introduction docs guard — verifies key usage guidance.
 */
import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

describe("Vue drawer introduction docs", () => {
  it("documents drawer intent, sizing, and ownership boundaries", () => {
    const introPath = path.resolve(__dirname, "../Introduction.mdx")
    const introDoc = readFileSync(introPath, "utf8")

    for (const expected of [
      "Drawer",
      "side-panel shell",
      "small",
      "medium",
      "large",
      "parent code owns open state",
      "optional scrim",
      "optional footer",
    ]) {
      expect(introDoc).toContain(expected)
    }
  })
})
