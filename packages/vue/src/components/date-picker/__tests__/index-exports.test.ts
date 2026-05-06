import { describe, expect, it } from "vitest"
import { DatePicker } from ".."

describe("DatePicker exports", () => {
  it("exports the component", () => {
    expect(DatePicker).toBeTypeOf("object")
  })
})
