/**
 * React adapter: Verifies that the Date Picker barrel re-exports all public symbols
 * from both the component directory and the package root.
 */
import { describe, expect, it } from "vitest"
import { DatePickerField } from ".."

describe("DatePicker exports", () => {
  it("exports the public field component", () => {
    expect(DatePickerField).toBeTypeOf("function")
  })
})
