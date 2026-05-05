import type { DatePickerDay } from "./date-picker-types"

export function resolveDatePickerDayLabel(day: DatePickerDay): string {
  if (day.ariaLabel) return day.ariaLabel
  if (day.date) return day.date
  return day.label
}
