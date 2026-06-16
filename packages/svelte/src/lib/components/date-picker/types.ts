import type { DatePickerDay, DatePickerOptions } from "@marwes-ui/core"

export interface DatePickerProps extends DatePickerOptions {
  weeks?: DatePickerDay[][]
  weekdayLabels?: string[]
  onpreviousyear?: () => void
  onpreviousmonth?: () => void
  onnextmonth?: () => void
  onnextyear?: () => void
  ondayselect?: (day: DatePickerDay) => void
  oncancel?: () => void
  onapply?: () => void
  class?: string
}

export interface DatePickerFieldProps {
  /** Optional: if omitted, a stable id is generated. */
  id?: string
  /** Field label (required for accessibility). */
  label: string
  /** Optional helper text shown below the calendar. */
  helperText?: string
  /** Optional error message. */
  error?: string
  /** Props forwarded to the DatePicker atom. */
  datePicker?: Omit<DatePickerProps, "ariaLabel" | "ariaLabelledBy" | "calendarLabel">
  /** Additional aria-describedby IDs to merge with internal helper/error IDs. */
  ariaDescribedBy?: string
  class?: string
}
