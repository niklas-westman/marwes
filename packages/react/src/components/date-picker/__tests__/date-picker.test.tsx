/**
 * React adapter: Tests the Date Picker component — wires the shared cross-adapter contract
 * and verifies adapter-specific rendering concerns.
 */
import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { DatePicker } from "../date-picker"

describe("DatePicker", () => {
  it("renders the shared date picker contract", () => {
    render(<DatePicker />)

    expect(screen.getByLabelText("Choose date")).toHaveAttribute("data-component", "date-picker")
    expect(screen.getByRole("table", { name: "March 2026" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "2026-03-04" })).toHaveAttribute(
      "aria-pressed",
      "true",
    )
    expect(screen.getByRole("button", { name: "Today" })).toBeInTheDocument()
  })

  it("emits selected days", () => {
    const onDaySelect = vi.fn()
    render(<DatePicker onDaySelect={onDaySelect} />)

    fireEvent.click(screen.getByRole("button", { name: "2026-03-13" }))

    expect(onDaySelect).toHaveBeenCalledWith(expect.objectContaining({ date: "2026-03-13" }))
  })
})
