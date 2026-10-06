/**
 * Vue adapter: Tests the Date Picker component — wires the shared cross-adapter contract
 * and verifies adapter-specific rendering concerns.
 */
import { cleanup, fireEvent, render, screen } from "@testing-library/vue"
import { afterEach, describe, expect, it, vi } from "vitest"
import { runDatePickerContract } from "../../../../../../tests/contracts/date-picker.contract"
import { DatePicker } from "../date-picker"

runDatePickerContract("vue", {
  renderDatePicker({ onDaySelect, ...args } = {}) {
    render(DatePicker, {
      props: {
        ...args,
        ...(onDaySelect ? { onDaySelect: (day: { date?: string }) => onDaySelect(day.date) } : {}),
      },
    })
  },
  async click(element) {
    await fireEvent.click(element)
  },
})

afterEach(cleanup)

describe("DatePicker", () => {
  it("renders the shared date picker contract", () => {
    render(DatePicker)

    expect(screen.getByLabelText("Choose date")).toHaveAttribute("data-component", "date-picker")
    expect(screen.getByRole("table", { name: "March 2026" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "2026-03-04" })).toHaveAttribute(
      "aria-pressed",
      "true",
    )
    expect(screen.getByRole("button", { name: "Today" })).toBeInTheDocument()
  })

  it("emits selected days", async () => {
    const onDaySelect = vi.fn()
    render(DatePicker, { props: { onDaySelect } })

    await fireEvent.click(screen.getByRole("button", { name: "2026-03-13" }))

    expect(onDaySelect).toHaveBeenCalledWith(expect.objectContaining({ date: "2026-03-13" }))
  })
})
