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
  /** ID(s) of elements that describe the calendar (helper text, errors). */
  ariaDescribedBy?: string
  /** @deprecated Use `ariaLabel` instead. */
  calendarLabel?: string
  dataAttributes?: Record<string, string>
}

export interface DatePickerA11yProps {
  ariaLabel?: string
  ariaLabelledBy?: string
  ariaDescribedBy?: string
}

/** ARIA fields for a month/year navigation button. */
export interface DatePickerNavButtonA11yProps {
  ariaLabel: string
}

/** ARIA fields for the calendar grid (the table of days). */
export interface DatePickerGridA11yProps {
  ariaLabel: string
}

/** ARIA fields for one day button. Empty filler cells are hidden from assistive technology. */
export interface DatePickerDayA11yProps {
  ariaLabel?: string
  ariaPressed?: true
  ariaHidden?: true
}

export interface DatePickerDataAttributes extends Record<string, string> {
  "data-component": "date-picker"
  "data-device": DatePickerDevice
}

export interface DatePickerDayRenderKit {
  className: string
  dataAttributes: Record<string, string>
  ariaLabel: string
  a11y: DatePickerDayA11yProps
  disabled: boolean
  selected: boolean
  isEmpty: boolean
}

export interface DatePickerRenderKit {
  className: string
  dataAttributes: DatePickerDataAttributes
  a11y: DatePickerA11yProps
  nav: {
    previousYear: DatePickerNavButtonA11yProps
    previousMonth: DatePickerNavButtonA11yProps
    nextMonth: DatePickerNavButtonA11yProps
    nextYear: DatePickerNavButtonA11yProps
  }
  grid: { a11y: DatePickerGridA11yProps }
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
