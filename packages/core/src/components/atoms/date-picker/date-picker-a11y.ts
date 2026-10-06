import type { DatePickerDay, DatePickerDayA11yProps } from "./date-picker-types"

export function resolveDatePickerDayLabel(day: DatePickerDay): string {
  if (day.ariaLabel) return day.ariaLabel
  if (day.date) return day.date
  return day.label
}

export function resolveDatePickerDayA11y(
  day: DatePickerDay,
  state: { selected: boolean; isEmpty: boolean },
): DatePickerDayA11yProps {
  // Empty filler cells keep their button for layout but are hidden and unnamed for assistive tech.
  if (state.isEmpty) return { ariaHidden: true }

  const a11y: DatePickerDayA11yProps = { ariaLabel: resolveDatePickerDayLabel(day) }
  if (state.selected) a11y.ariaPressed = true
  return a11y
}
