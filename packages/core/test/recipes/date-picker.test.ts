import { describe, expect, it } from "vitest"
import { createDatePickerRecipe, resolveDatePickerDayLabel } from "../../src"

describe("createDatePickerRecipe", () => {
  it("creates a desktop date picker render kit by default", () => {
    const kit = createDatePickerRecipe()

    expect(kit.dataAttributes).toMatchObject({
      "data-component": "date-picker",
      "data-device": "desktop",
    })
    expect(kit.monthLabel).toBe("March 2026")
    expect(kit.weekdayLabels).toEqual(["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"])
    expect(kit.weeks).toHaveLength(6)
  })

  it("maps selected, range, and null day states", () => {
    const kit = createDatePickerRecipe()
    const flatDayKits = kit.dayKits.flat()

    expect(flatDayKits.some((day) => day.selected)).toBe(true)
    expect(flatDayKits.some((day) => day.dataAttributes["data-state"] === "range")).toBe(true)
    expect(flatDayKits.some((day) => day.isEmpty)).toBe(true)
  })

  it("accepts mobile and custom labels", () => {
    const kit = createDatePickerRecipe({ device: "mobile", monthLabel: "June 2026" })

    expect(kit.dataAttributes["data-device"]).toBe("mobile")
    expect(kit.monthLabel).toBe("June 2026")
  })
})

describe("resolveDatePickerDayLabel", () => {
  it("prefers explicit accessible labels", () => {
    expect(resolveDatePickerDayLabel({ label: "8", ariaLabel: "Friday 8 May" })).toBe(
      "Friday 8 May",
    )
  })
})
