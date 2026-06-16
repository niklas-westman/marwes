import { resolveDatePickerDayLabel } from "./date-picker-a11y"
import type {
  DatePickerDay,
  DatePickerDayRenderKit,
  DatePickerDevice,
  DatePickerOptions,
  DatePickerRenderKit,
} from "./date-picker-types"

const datePickerDevices = ["desktop", "mobile"] as const

const defaultWeekdayLabels = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"] as const
const defaultWeeks: readonly (readonly DatePickerDay[])[] = [
  [
    { label: "", state: "null" },
    { label: "", state: "null" },
    { label: "", state: "null" },
    { label: "", state: "null" },
    { label: "", state: "null" },
    { label: "", state: "null" },
    { label: "01", date: "2026-03-01" },
  ],
  [
    { label: "02", date: "2026-03-02" },
    { label: "03", date: "2026-03-03" },
    { label: "04", date: "2026-03-04", state: "selected" },
    { label: "05", date: "2026-03-05", state: "range" },
    { label: "06", date: "2026-03-06", state: "range" },
    { label: "07", date: "2026-03-07", state: "range" },
    { label: "08", date: "2026-03-08", state: "selected" },
  ],
  [
    { label: "09", date: "2026-03-09" },
    { label: "10", date: "2026-03-10" },
    { label: "11", date: "2026-03-11" },
    { label: "12", date: "2026-03-12" },
    { label: "13", date: "2026-03-13" },
    { label: "14", date: "2026-03-14" },
    { label: "15", date: "2026-03-15" },
  ],
  [
    { label: "16", date: "2026-03-16" },
    { label: "17", date: "2026-03-17" },
    { label: "18", date: "2026-03-18" },
    { label: "19", date: "2026-03-19" },
    { label: "20", date: "2026-03-20" },
    { label: "21", date: "2026-03-21" },
    { label: "22", date: "2026-03-22" },
  ],
  [
    { label: "23", date: "2026-03-23" },
    { label: "24", date: "2026-03-24" },
    { label: "25", date: "2026-03-25" },
    { label: "26", date: "2026-03-26" },
    { label: "27", date: "2026-03-27" },
    { label: "28", date: "2026-03-28" },
    { label: "29", date: "2026-03-29" },
  ],
  [
    { label: "30", date: "2026-03-30" },
    { label: "31", date: "2026-03-31" },
    { label: "", state: "null" },
    { label: "", state: "null" },
    { label: "", state: "null" },
    { label: "", state: "null" },
    { label: "", state: "null" },
  ],
] as const

function resolveDevice(device: DatePickerDevice | undefined): DatePickerDevice {
  return device && datePickerDevices.includes(device) ? device : "desktop"
}

function createDayKit(day: DatePickerDay): DatePickerDayRenderKit {
  const state = day.state ?? "default"
  const isEmpty = state === "null" || day.label === ""
  const disabled = state === "disabled" || isEmpty
  const selected = state === "selected"

  return {
    className: [
      "mw-date-picker__day",
      `mw-date-picker__day--${state}`,
      day.isToday ? "mw-date-picker__day--today" : null,
    ]
      .filter(Boolean)
      .join(" "),
    dataAttributes: {
      "data-component": "date-picker-day",
      "data-state": state,
      ...(day.date ? { "data-date": day.date } : {}),
      ...(day.isToday ? { "data-today": "true" } : {}),
    },
    ariaLabel: resolveDatePickerDayLabel(day),
    disabled,
    selected,
    isEmpty,
  }
}

export function createDatePickerRecipe(opts: DatePickerOptions = {}): DatePickerRenderKit {
  const device = resolveDevice(opts.device)
  const weeks = opts.weeks ?? defaultWeeks
  const calendarLabel = opts.ariaLabel ?? opts.calendarLabel ?? "Choose date"
  const a11y: DatePickerRenderKit["a11y"] = opts.ariaLabelledBy
    ? { ariaLabelledBy: opts.ariaLabelledBy }
    : { ariaLabel: calendarLabel }
  if (opts.ariaDescribedBy) a11y.ariaDescribedBy = opts.ariaDescribedBy

  return {
    className: ["mw-date-picker", `mw-date-picker--${device}`].join(" "),
    dataAttributes: {
      ...opts.dataAttributes,
      "data-component": "date-picker",
      "data-device": device,
    },
    a11y,
    monthLabel: opts.monthLabel ?? "March 2026",
    weekdayLabels: opts.weekdayLabels ?? defaultWeekdayLabels,
    weeks,
    dayKits: weeks.map((week) => week.map(createDayKit)),
    slots: {
      headerClassName: "mw-date-picker__header",
      navGroupClassName: "mw-date-picker__nav-group",
      navButtonClassName: "mw-date-picker__nav-button",
      monthLabelClassName: "mw-date-picker__month-label",
      gridClassName: "mw-date-picker__grid",
      weekdayClassName: "mw-date-picker__weekday",
      weekClassName: "mw-date-picker__week",
      cellClassName: "mw-date-picker__cell",
      dayClassName: "mw-date-picker__day",
      footerClassName: "mw-date-picker__footer",
      footerButtonClassName: "mw-date-picker__footer-button",
    },
    labels: {
      calendar: calendarLabel,
      previousYear: opts.previousYearLabel ?? "Previous year",
      previousMonth: opts.previousMonthLabel ?? "Previous month",
      nextMonth: opts.nextMonthLabel ?? "Next month",
      nextYear: opts.nextYearLabel ?? "Next year",
      cancel: opts.cancelLabel ?? "Today",
      apply: opts.applyLabel ?? "",
    },
  }
}
