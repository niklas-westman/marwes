import {
  type DatePickerDay,
  type DatePickerDevice,
  type DatePickerOptions,
  createDatePickerRecipe,
} from "@marwes-ui/core"
import type * as React from "react"

export interface DatePickerProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "children" | "onSelect">,
    Pick<
      DatePickerOptions,
      | "monthLabel"
      | "weekdayLabels"
      | "weeks"
      | "previousYearLabel"
      | "previousMonthLabel"
      | "nextMonthLabel"
      | "nextYearLabel"
      | "cancelLabel"
      | "applyLabel"
      | "calendarLabel"
      | "dataAttributes"
    > {
  device?: DatePickerDevice
  onPreviousYear?: () => void
  onPreviousMonth?: () => void
  onNextMonth?: () => void
  onNextYear?: () => void
  onDaySelect?: (day: DatePickerDay) => void
  onCancel?: () => void
  onApply?: () => void
}

export function DatePicker(props: DatePickerProps): React.ReactElement {
  const {
    className,
    monthLabel,
    weekdayLabels,
    weeks,
    device,
    previousYearLabel,
    previousMonthLabel,
    nextMonthLabel,
    nextYearLabel,
    cancelLabel,
    applyLabel,
    calendarLabel,
    dataAttributes,
    onPreviousYear,
    onPreviousMonth,
    onNextMonth,
    onNextYear,
    onDaySelect,
    onCancel,
    onApply,
    ...nativeProps
  } = props
  const kit = createDatePickerRecipe({
    ...(monthLabel !== undefined ? { monthLabel } : {}),
    ...(weekdayLabels !== undefined ? { weekdayLabels } : {}),
    ...(weeks !== undefined ? { weeks } : {}),
    ...(device !== undefined ? { device } : {}),
    ...(previousYearLabel !== undefined ? { previousYearLabel } : {}),
    ...(previousMonthLabel !== undefined ? { previousMonthLabel } : {}),
    ...(nextMonthLabel !== undefined ? { nextMonthLabel } : {}),
    ...(nextYearLabel !== undefined ? { nextYearLabel } : {}),
    ...(cancelLabel !== undefined ? { cancelLabel } : {}),
    ...(applyLabel !== undefined ? { applyLabel } : {}),
    ...(calendarLabel !== undefined ? { calendarLabel } : {}),
    ...(dataAttributes !== undefined ? { dataAttributes } : {}),
  })
  const mergedClassName = [kit.className, className].filter(Boolean).join(" ")

  return (
    <section
      {...nativeProps}
      {...kit.dataAttributes}
      className={mergedClassName}
      aria-label={kit.labels.calendar}
    >
      <header className={kit.slots.headerClassName}>
        <div className={kit.slots.navGroupClassName}>
          <button
            type="button"
            className={kit.slots.navButtonClassName}
            aria-label={kit.labels.previousYear}
            onClick={onPreviousYear}
          >
            «
          </button>
          <button
            type="button"
            className={kit.slots.navButtonClassName}
            aria-label={kit.labels.previousMonth}
            onClick={onPreviousMonth}
          >
            ‹
          </button>
        </div>
        <div className={kit.slots.monthLabelClassName}>{kit.monthLabel}</div>
        <div className={kit.slots.navGroupClassName}>
          <button
            type="button"
            className={kit.slots.navButtonClassName}
            aria-label={kit.labels.nextMonth}
            onClick={onNextMonth}
          >
            ›
          </button>
          <button
            type="button"
            className={kit.slots.navButtonClassName}
            aria-label={kit.labels.nextYear}
            onClick={onNextYear}
          >
            »
          </button>
        </div>
      </header>
      <table className={kit.slots.gridClassName} aria-label={kit.monthLabel}>
        <thead>
          <tr className="mw-date-picker__weekdays">
            {kit.weekdayLabels.map((weekday) => (
              <th key={weekday} className={kit.slots.weekdayClassName} scope="col">
                {weekday}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {kit.weeks.map((week, weekIndex) => (
            <tr
              key={week.map((day) => day.date ?? day.label).join("-")}
              className={kit.slots.weekClassName}
            >
              {week.map((day, dayIndex) => {
                const dayKit = kit.dayKits[weekIndex]?.[dayIndex]
                if (!dayKit) return null
                return (
                  <td
                    key={day.date ?? `${weekIndex}-${dayIndex}`}
                    className={kit.slots.cellClassName}
                  >
                    <button
                      type="button"
                      {...dayKit.dataAttributes}
                      className={dayKit.className}
                      aria-label={dayKit.ariaLabel}
                      aria-selected={dayKit.selected}
                      disabled={dayKit.disabled}
                      onClick={() => onDaySelect?.(day)}
                    >
                      {day.label}
                    </button>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <footer className={kit.slots.footerClassName}>
        <button type="button" className={kit.slots.footerButtonClassName} onClick={onCancel}>
          {kit.labels.cancel}
        </button>
        {kit.labels.apply ? (
          <button
            type="button"
            className={`${kit.slots.footerButtonClassName} mw-date-picker__footer-button--primary`}
            onClick={onApply}
          >
            {kit.labels.apply}
          </button>
        ) : null}
      </footer>
    </section>
  )
}
