import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

describe("Svelte dialog introduction docs", () => {
  it("documents atom, modal, and purpose dialog layers", () => {
    const introDoc = readFileSync(path.resolve(__dirname, "../Introduction.mdx"), "utf8")

    for (const value of ["Dialog", "DialogModal", "ConfirmDialog", "DestructiveDialog"]) {
      expect(introDoc).toContain(value)
    }
  })
})
