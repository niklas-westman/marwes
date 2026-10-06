/**
 * Shared contract for the DatePicker atom — calendar landmark naming, navigation button names,
 * grid name, day button semantics (selected, empty filler cells) and day selection.
 */
import type { DatePickerOptions } from "@marwes-ui/core"
import { describe, expect, it } from "vitest"

export interface DatePickerContractHarness {
  renderDatePicker(args?: {
    ariaLabel?: string
    calendarLabel?: string
    ariaLabelledBy?: string
    ariaDescribedBy?: string
    monthLabel?: string
    previousYearLabel?: string
    previousMonthLabel?: string
    nextMonthLabel?: string
    nextYearLabel?: string
    onDaySelect?: (date: string | undefined) => void
  }): Promise<void> | void
  click(element: HTMLElement): Promise<void> | void
  /** Renders the base DatePicker with raw core options. */
  renderDatePickerOptions(options: DatePickerOptions): Promise<void> | void
}

function getRoot(): HTMLElement {
  return document.querySelector('[data-component="date-picker"]') as HTMLElement
}

function getDay(date: string): HTMLElement {
  return document.querySelector(
    `[data-component="date-picker-day"][data-date="${date}"]`,
  ) as HTMLElement
}

type DatePickerOptionCase = {
  options: DatePickerOptions
  expectRendered: (root: HTMLElement) => void
}

const aprilWeeks = [[{ label: "01", date: "2026-04-01" }]] as const

// Exhaustive on purpose: a new core DatePickerOptions field fails to compile until every adapter's
// handling of it is described by a case.
const datePickerOptionCases: Record<keyof DatePickerOptions, DatePickerOptionCase> = {
  monthLabel: {
    options: { monthLabel: "April 2026" },
    expectRendered: (root) =>
      expect(root.querySelector("table")).toHaveAttribute("aria-label", "April 2026"),
  },
  weekdayLabels: {
    options: { weekdayLabels: ["M", "T", "W", "T", "F", "S", "S"] },
    expectRendered: (root) =>
      expect([...root.querySelectorAll("th")].map((th) => th.textContent)).toEqual([
        "M",
        "T",
        "W",
        "T",
        "F",
        "S",
        "S",
      ]),
  },
  weeks: {
    options: { weeks: aprilWeeks },
    expectRendered: (root) => expect(root.querySelector('[data-date="2026-04-01"]')).not.toBeNull(),
  },
  device: {
    options: { device: "mobile" },
    expectRendered: (root) => expect(root).toHaveAttribute("data-device", "mobile"),
  },
  previousYearLabel: {
    options: { previousYearLabel: "PY" },
    expectRendered: (root) =>
      expect(root.querySelectorAll(".mw-date-picker__nav-button")[0]).toHaveAttribute(
        "aria-label",
        "PY",
      ),
  },
  previousMonthLabel: {
    options: { previousMonthLabel: "PM" },
    expectRendered: (root) =>
      expect(root.querySelectorAll(".mw-date-picker__nav-button")[1]).toHaveAttribute(
        "aria-label",
        "PM",
      ),
  },
  nextMonthLabel: {
    options: { nextMonthLabel: "NM" },
    expectRendered: (root) =>
      expect(root.querySelectorAll(".mw-date-picker__nav-button")[2]).toHaveAttribute(
        "aria-label",
        "NM",
      ),
  },
  nextYearLabel: {
    options: { nextYearLabel: "NY" },
    expectRendered: (root) =>
      expect(root.querySelectorAll(".mw-date-picker__nav-button")[3]).toHaveAttribute(
        "aria-label",
        "NY",
      ),
  },
  cancelLabel: {
    options: { cancelLabel: "Reset" },
    expectRendered: (root) =>
      expect(root.querySelector(".mw-date-picker__footer-button")).toHaveTextContent("Reset"),
  },
  applyLabel: {
    options: { applyLabel: "Apply" },
    expectRendered: (root) =>
      expect(root.querySelector(".mw-date-picker__footer")).toHaveTextContent("Apply"),
  },
  ariaLabel: {
    options: { ariaLabel: "Departure" },
    expectRendered: (root) => expect(root).toHaveAttribute("aria-label", "Departure"),
  },
  ariaLabelledBy: {
    options: { ariaLabelledBy: "label-id" },
    expectRendered: (root) => expect(root).toHaveAttribute("aria-labelledby", "label-id"),
  },
  ariaDescribedBy: {
    options: { ariaDescribedBy: "hint-id" },
    expectRendered: (root) => expect(root).toHaveAttribute("aria-describedby", "hint-id"),
  },
  calendarLabel: {
    options: { calendarLabel: "Pick a day" },
    expectRendered: (root) => expect(root).toHaveAttribute("aria-label", "Pick a day"),
  },
  dataAttributes: {
    options: { dataAttributes: { "data-track": "dp" } },
    expectRendered: (root) => expect(root).toHaveAttribute("data-track", "dp"),
  },
}

export function runDatePickerContract(
  adapterName: string,
  harness: DatePickerContractHarness,
): void {
  describe(`DatePicker contract: ${adapterName}`, () => {
    it("renders the calendar landmark with the default accessible name", async () => {
      await harness.renderDatePicker()

      const root = getRoot()
      expect(root).toHaveAttribute("data-device", "desktop")
      expect(root).toHaveAttribute("aria-label", "Choose date")
      expect(root).not.toHaveAttribute("aria-labelledby")
    })

    it("accepts the deprecated calendarLabel and lets ariaLabel win over it", async () => {
      await harness.renderDatePicker({ calendarLabel: "Pick a day" })
      expect(getRoot()).toHaveAttribute("aria-label", "Pick a day")
    })

    it("prefers ariaLabel over calendarLabel", async () => {
      await harness.renderDatePicker({ ariaLabel: "Departure", calendarLabel: "Pick a day" })
      expect(getRoot()).toHaveAttribute("aria-label", "Departure")
    })

    it("labels the calendar by an external element instead of a generated name", async () => {
      await harness.renderDatePicker({ ariaLabelledBy: "external-label", ariaLabel: "Ignored" })

      const root = getRoot()
      expect(root).toHaveAttribute("aria-labelledby", "external-label")
      expect(root).not.toHaveAttribute("aria-label")
    })

    it("forwards aria-describedby to the calendar landmark", async () => {
      await harness.renderDatePicker({ ariaDescribedBy: "helper-id" })
      expect(getRoot()).toHaveAttribute("aria-describedby", "helper-id")
    })

    it("names the four navigation buttons, with overridable labels", async () => {
      await harness.renderDatePicker()

      const navButtons = [
        ...getRoot().querySelectorAll<HTMLElement>(".mw-date-picker__nav-button"),
      ].map((button) => button.getAttribute("aria-label"))
      expect(navButtons).toEqual(["Previous year", "Previous month", "Next month", "Next year"])
    })

    it("uses custom navigation labels", async () => {
      await harness.renderDatePicker({
        previousYearLabel: "Föregående år",
        previousMonthLabel: "Föregående månad",
        nextMonthLabel: "Nästa månad",
        nextYearLabel: "Nästa år",
      })

      const navButtons = [
        ...getRoot().querySelectorAll<HTMLElement>(".mw-date-picker__nav-button"),
      ].map((button) => button.getAttribute("aria-label"))
      expect(navButtons).toEqual(["Föregående år", "Föregående månad", "Nästa månad", "Nästa år"])
    })

    it("names the day grid after the month label", async () => {
      await harness.renderDatePicker({ monthLabel: "April 2026" })

      expect(getRoot().querySelector("table")).toHaveAttribute("aria-label", "April 2026")
    })

    it("names day buttons by date and marks only selected days as pressed", async () => {
      await harness.renderDatePicker()

      const selectedDay = getDay("2026-03-04")
      const plainDay = getDay("2026-03-05")
      expect(selectedDay).toHaveAttribute("aria-label", "2026-03-04")
      expect(selectedDay).toHaveAttribute("aria-pressed", "true")
      expect(plainDay).toHaveAttribute("aria-label", "2026-03-05")
      expect(plainDay).not.toHaveAttribute("aria-pressed")
    })

    it("hides empty filler cells from assistive technology and disables them", async () => {
      await harness.renderDatePicker()

      const emptyDays = [
        ...getRoot().querySelectorAll<HTMLElement>(
          '[data-component="date-picker-day"][data-state="null"]',
        ),
      ]
      expect(emptyDays.length).toBeGreaterThan(0)
      for (const emptyDay of emptyDays) {
        expect(emptyDay).toHaveAttribute("aria-hidden", "true")
        expect(emptyDay).not.toHaveAttribute("aria-label")
        expect(emptyDay).toBeDisabled()
      }
    })

    it("reports the chosen date and ignores empty cells", async () => {
      const chosen: Array<string | undefined> = []
      await harness.renderDatePicker({ onDaySelect: (date) => chosen.push(date) })

      await harness.click(getDay("2026-03-13"))
      await harness.click(getRoot().querySelector('[data-state="null"]') as HTMLElement)

      expect(chosen).toEqual(["2026-03-13"])
    })

    describe("every core option reaches the DOM", () => {
      it.each(Object.entries(datePickerOptionCases))("%s", async (_optionName, optionCase) => {
        await harness.renderDatePickerOptions(optionCase.options)

        const root = getRoot()
        expect(root).toBeInTheDocument()
        optionCase.expectRendered(root)
      })
    })
  })
}
