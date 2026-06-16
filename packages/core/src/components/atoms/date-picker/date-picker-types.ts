export type DatePickerDevice = "desktop" | "mobile"
export type DatePickerDayState =
  | "default"
  | "hover"
  | "selected"
  | "range"
  | "range-hover"
  | "disabled"
  | "null"

export interface DatePickerDay {
  label: string
  date?: string
  state?: DatePickerDayState
  isToday?: boolean
  ariaLabel?: string
}

export interface DatePickerOptions {
  monthLabel?: string
  weekdayLabels?: readonly string[]
  weeks?: readonly (readonly DatePickerDay[])[]
  device?: DatePickerDevice
  previousYearLabel?: string
  previousMonthLabel?: string
  nextMonthLabel?: string
  nextYearLabel?: string
  cancelLabel?: string
  applyLabel?: string
  /** Accessible name for the calendar landmark. Alias for `calendarLabel`. */
  ariaLabel?: string
  /** ID of an element whose text labels the calendar landmark. Wins over `ariaLabel`/`calendarLabel`. */
  ariaLabelledBy?: string
  /** @deprecated Use `ariaLabel` instead. */
  calendarLabel?: string
  dataAttributes?: Record<string, string>
}

export interface DatePickerA11yProps {
  ariaLabel?: string
  ariaLabelledBy?: string
}

export interface DatePickerDataAttributes extends Record<string, string> {
  "data-component": "date-picker"
  "data-device": DatePickerDevice
}

export interface DatePickerDayRenderKit {
  className: string
  dataAttributes: Record<string, string>
  ariaLabel: string
  disabled: boolean
  selected: boolean
  isEmpty: boolean
}

export interface DatePickerRenderKit {
  className: string
  dataAttributes: DatePickerDataAttributes
  a11y: DatePickerA11yProps
  monthLabel: string
  weekdayLabels: readonly string[]
  weeks: readonly (readonly DatePickerDay[])[]
  dayKits: readonly (readonly DatePickerDayRenderKit[])[]
  slots: {
    headerClassName: string
    navGroupClassName: string
    navButtonClassName: string
    monthLabelClassName: string
    gridClassName: string
    weekdayClassName: string
    weekClassName: string
    cellClassName: string
    dayClassName: string
    footerClassName: string
    footerButtonClassName: string
  }
  labels: {
    calendar: string
    previousYear: string
    previousMonth: string
    nextMonth: string
    nextYear: string
    cancel: string
    apply: string
  }
}
