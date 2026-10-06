import {
  type DatePickerDay,
  type DatePickerDevice,
  type DatePickerOptions,
  createDatePickerRecipe,
  toDatePickerDayHtmlAttributes,
  toDatePickerGridHtmlAttributes,
  toDatePickerHtmlAttributes,
  toDatePickerNavButtonHtmlAttributes,
} from "@marwes-ui/core"
import type * as React from "react"
import { toReactAttributes } from "../../internal/react-attributes"

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
      | "ariaLabel"
      | "ariaLabelledBy"
      | "ariaDescribedBy"
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
    ariaLabel,
    ariaLabelledBy,
    ariaDescribedBy,
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
    ...(ariaLabel !== undefined ? { ariaLabel } : {}),
    ...(ariaLabelledBy !== undefined ? { ariaLabelledBy } : {}),
    ...(ariaDescribedBy !== undefined ? { ariaDescribedBy } : {}),
    ...(calendarLabel !== undefined ? { calendarLabel } : {}),
    ...(dataAttributes !== undefined ? { dataAttributes } : {}),
  })
  const mergedClassName = [kit.className, className].filter(Boolean).join(" ")

  return (
    <section
      {...nativeProps}
      {...kit.dataAttributes}
      className={mergedClassName}
      {...toReactAttributes(toDatePickerHtmlAttributes(kit.a11y))}
    >
      <header className={kit.slots.headerClassName}>
        <div className={kit.slots.navGroupClassName}>
          <button
            type="button"
            className={kit.slots.navButtonClassName}
            {...toReactAttributes(toDatePickerNavButtonHtmlAttributes(kit.nav.previousYear))}
            onClick={onPreviousYear}
          >
            «
          </button>
          <button
            type="button"
            className={kit.slots.navButtonClassName}
            {...toReactAttributes(toDatePickerNavButtonHtmlAttributes(kit.nav.previousMonth))}
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
            {...toReactAttributes(toDatePickerNavButtonHtmlAttributes(kit.nav.nextMonth))}
            onClick={onNextMonth}
          >
            ›
          </button>
          <button
            type="button"
            className={kit.slots.navButtonClassName}
            {...toReactAttributes(toDatePickerNavButtonHtmlAttributes(kit.nav.nextYear))}
            onClick={onNextYear}
          >
            »
          </button>
        </div>
      </header>
      <table
        className={kit.slots.gridClassName}
        {...toReactAttributes(toDatePickerGridHtmlAttributes(kit.grid.a11y))}
      >
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
                      {...toReactAttributes(toDatePickerDayHtmlAttributes(dayKit.a11y))}
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
