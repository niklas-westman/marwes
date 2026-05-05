import { describe, expect, it } from "vitest"
import { StatTile } from "../index"

describe("stat tile exports", () => {
  it("exports StatTile", () => {
    expect(StatTile).toBeTypeOf("function")
  })
})
