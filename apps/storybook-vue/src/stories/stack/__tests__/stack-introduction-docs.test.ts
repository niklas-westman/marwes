/**
 * Vue Stack introduction docs guard — verifies that Introduction.mdx documents
 * the Penpot mapping and the verification rules the family relies on.
 */
import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

describe("Vue stack introduction docs", () => {
  it("documents the layout primitive, its Penpot mapping and verification rules", () => {
    const introDoc = readFileSync(path.resolve(__dirname, "../Introduction.mdx"), "utf8")

    for (const value of [
      "Stack (Atom)",
      "StackItem (Atom)",
      "Penpot mapping",
      "Only StackItem or Stack children are governed",
      "`fix` is declared-only",
      "Sizing has no effect outside a Stack parent",
      "Penpot stretch is child fill",
      "data-* attributes are claims",
      "Token name and rendered px are separate checks",
      "No sp-6",
      "No arbitrary px",
      "Accessibility",
      "Story Coverage",
    ]) {
      expect(introDoc).toContain(value)
    }
  })
})
