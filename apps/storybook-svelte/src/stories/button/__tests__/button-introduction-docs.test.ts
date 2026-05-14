/**
 * Svelte Button introduction docs guard.
 */
import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

describe("Svelte button introduction docs", () => {
  it("documents button layers and success wrapper", () => {
    const introDoc = readFileSync(path.resolve(__dirname, "../Introduction.mdx"), "utf8")

    for (const value of ["Button", "PrimaryButton", "SecondaryButton", "SuccessButton"]) {
      expect(introDoc).toContain(value)
    }
  })
})
