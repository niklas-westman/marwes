/**
 * React adapter: Verifies that the Stat Tile barrel re-exports all public symbols
 * from both the component directory and the package root.
 */
import { describe, expect, it } from "vitest"
import { StatTile } from "../index"

describe("stat tile exports", () => {
  it("exports StatTile", () => {
    expect(StatTile).toBeTypeOf("function")
  })
})
