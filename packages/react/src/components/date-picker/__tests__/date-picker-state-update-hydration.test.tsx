import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import {
  type DatePickerUpdatesProps,
  runDatePickerUpdatesContract,
} from "../../../../../../tests/contracts/date-picker-updates.contract"
import { createUpdateHydrationHarness } from "../../../test-support/update-hydration"
import { DatePicker } from "../date-picker"
function weeks(selectedDate: string) {
  return [
    [
      {
        label: "1",
        date: "2026-10-01",
        state: selectedDate === "2026-10-01" ? ("selected" as const) : ("default" as const),
      },
      {
        label: "2",
        date: "2026-10-02",
        state: selectedDate === "2026-10-02" ? ("selected" as const) : ("default" as const),
      },
      { label: "3", date: "2026-10-03", state: "disabled" as const },
    ],
  ]
}
runDatePickerUpdatesContract("react", {
  ...createUpdateHydrationHarness(
    ({ selectedDate, onDaySelect, ...props }: DatePickerUpdatesProps) => (
      <DatePicker
        {...props}
        weeks={weeks(selectedDate)}
        {...(onDaySelect ? { onDaySelect: (day) => onDaySelect(day.date ?? "") } : {})}
      />
    ),
  ),
  getDay: (date) => screen.getByRole("button", { name: date }),
  getNextMonth: () => screen.getByRole("button", { name: "Next month" }),
  getCalendar: () => screen.getByRole("table"),
  async click(element) {
    await userEvent.setup().click(element)
  },
})
