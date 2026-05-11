/**
 * Svelte adapter: Tests the DatePicker component — basic rendering
 * and class application.
 */
import { render } from "@testing-library/svelte"
import { describe, expect, it } from "vitest"
import DatePicker from "../lib/components/date-picker/DatePicker.svelte"

describe("DatePicker", () => {
  const defaultWeeks = [
    [
      { label: "1", date: "2026-03-01", state: "default" as const },
      { label: "2", date: "2026-03-02", state: "default" as const },
      { label: "3", date: "2026-03-03", state: "default" as const },
      { label: "4", date: "2026-03-04", state: "default" as const },
      { label: "5", date: "2026-03-05", state: "default" as const },
      { label: "6", date: "2026-03-06", state: "default" as const },
      { label: "7", date: "2026-03-07", state: "default" as const },
    ],
  ]

  it("renders with data-component=date-picker", () => {
    const { container } = render(DatePicker, {
      props: {
        monthLabel: "March 2026",
        weekdayLabels: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
        weeks: defaultWeeks,
      },
    })
    const el = container.querySelector('[data-component="date-picker"]')
    expect(el).not.toBeNull()
  })

  it("includes mw-date-picker class", () => {
    const { container } = render(DatePicker, {
      props: {
        monthLabel: "March 2026",
        weekdayLabels: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
        weeks: defaultWeeks,
      },
    })
    const el = container.querySelector(".mw-date-picker")
    expect(el).not.toBeNull()
  })

  it("renders the month label", () => {
    const { container } = render(DatePicker, {
      props: {
        monthLabel: "March 2026",
        weekdayLabels: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
        weeks: defaultWeeks,
      },
    })
    expect(container.textContent).toContain("March 2026")
  })

  it("renders navigation buttons", () => {
    const { container } = render(DatePicker, {
      props: {
        monthLabel: "March 2026",
        weekdayLabels: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
        weeks: defaultWeeks,
      },
    })
    const buttons = container.querySelectorAll("button")
    // Nav buttons + day buttons + footer buttons
    expect(buttons.length).toBeGreaterThanOrEqual(4)
  })

  it("renders day buttons", () => {
    const { container } = render(DatePicker, {
      props: {
        monthLabel: "March 2026",
        weekdayLabels: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
        weeks: defaultWeeks,
      },
    })
    const dayButtons = container.querySelectorAll('[data-component="date-picker-day"]')
    expect(dayButtons.length).toBe(7)
  })
})
