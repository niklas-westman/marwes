import { cleanup, fireEvent, render, screen } from "@testing-library/vue"
import { afterEach, describe, expect, it, vi } from "vitest"
import { DatePicker } from "../date-picker"

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
