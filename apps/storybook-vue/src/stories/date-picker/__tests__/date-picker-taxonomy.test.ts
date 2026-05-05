import { describe, expect, it } from "vitest"
import meta from "../date-picker.stories"

describe("Date Picker story taxonomy", () => {
  it("uses the DatePicker atom namespace", () => {
    expect(meta.title).toBe("DatePicker/Atom")
  })
})
