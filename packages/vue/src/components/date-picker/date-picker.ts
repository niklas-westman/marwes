import {
  type DatePickerDay,
  type DatePickerDevice,
  type DatePickerOptions,
  createDatePickerRecipe,
} from "@marwes-ui/core"
import { computed, defineComponent, h, useAttrs } from "vue"
import { mergeClassNames, omitAttrs } from "../../internal/render-utils"

export interface DatePickerProps
  extends Pick<
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
  className?: string
  device?: DatePickerDevice
}

const datePickerPropKeys = [
  "className",
  "monthLabel",
  "weekdayLabels",
  "weeks",
  "device",
  "previousYearLabel",
  "previousMonthLabel",
  "nextMonthLabel",
  "nextYearLabel",
  "cancelLabel",
  "applyLabel",
  "ariaLabel",
  "ariaLabelledBy",
  "ariaDescribedBy",
  "calendarLabel",
  "dataAttributes",
] as const

export const DatePicker = defineComponent(
  (props: DatePickerProps, { emit }) => {
    const attrs = useAttrs()
    const renderKit = computed(() =>
      createDatePickerRecipe({
        ...(props.monthLabel !== undefined ? { monthLabel: props.monthLabel } : {}),
        ...(props.weekdayLabels !== undefined ? { weekdayLabels: props.weekdayLabels } : {}),
        ...(props.weeks !== undefined ? { weeks: props.weeks } : {}),
        ...(props.device !== undefined ? { device: props.device } : {}),
        ...(props.previousYearLabel !== undefined
          ? { previousYearLabel: props.previousYearLabel }
          : {}),
        ...(props.previousMonthLabel !== undefined
          ? { previousMonthLabel: props.previousMonthLabel }
          : {}),
        ...(props.nextMonthLabel !== undefined ? { nextMonthLabel: props.nextMonthLabel } : {}),
        ...(props.nextYearLabel !== undefined ? { nextYearLabel: props.nextYearLabel } : {}),
        ...(props.cancelLabel !== undefined ? { cancelLabel: props.cancelLabel } : {}),
        ...(props.applyLabel !== undefined ? { applyLabel: props.applyLabel } : {}),
        ...(props.ariaLabel !== undefined ? { ariaLabel: props.ariaLabel } : {}),
        ...(props.ariaLabelledBy !== undefined ? { ariaLabelledBy: props.ariaLabelledBy } : {}),
        ...(props.ariaDescribedBy !== undefined ? { ariaDescribedBy: props.ariaDescribedBy } : {}),
        ...(props.calendarLabel !== undefined ? { calendarLabel: props.calendarLabel } : {}),
        ...(props.dataAttributes !== undefined ? { dataAttributes: props.dataAttributes } : {}),
      }),
    )

    return () => {
      const kit = renderKit.value
      const passthroughAttrs = omitAttrs(attrs as Record<string, unknown>, ["class", "style"])

      return h(
        "section",
        {
          ...passthroughAttrs,
          ...kit.dataAttributes,
          class: mergeClassNames(kit.className, props.className, attrs.class),
          "aria-label": kit.a11y.ariaLabel,
          "aria-labelledby": kit.a11y.ariaLabelledBy,
          "aria-describedby": kit.a11y.ariaDescribedBy,
        },
        [
          h("header", { class: kit.slots.headerClassName }, [
            h("div", { class: kit.slots.navGroupClassName }, [
              h(
                "button",
                {
                  type: "button",
                  class: kit.slots.navButtonClassName,
                  "aria-label": kit.labels.previousYear,
                  onClick: () => emit("previousYear"),
                },
                "«",
              ),
              h(
                "button",
                {
                  type: "button",
                  class: kit.slots.navButtonClassName,
                  "aria-label": kit.labels.previousMonth,
                  onClick: () => emit("previousMonth"),
                },
                "‹",
              ),
            ]),
            h("div", { class: kit.slots.monthLabelClassName }, kit.monthLabel),
            h("div", { class: kit.slots.navGroupClassName }, [
              h(
                "button",
                {
                  type: "button",
                  class: kit.slots.navButtonClassName,
                  "aria-label": kit.labels.nextMonth,
                  onClick: () => emit("nextMonth"),
                },
                "›",
              ),
              h(
                "button",
                {
                  type: "button",
                  class: kit.slots.navButtonClassName,
                  "aria-label": kit.labels.nextYear,
                  onClick: () => emit("nextYear"),
                },
                "»",
              ),
            ]),
          ]),
          h("table", { class: kit.slots.gridClassName, "aria-label": kit.monthLabel }, [
            h("thead", [
              h(
                "tr",
                { class: "mw-date-picker__weekdays" },
                kit.weekdayLabels.map((weekday) =>
                  h(
                    "th",
                    { key: weekday, class: kit.slots.weekdayClassName, scope: "col" },
                    weekday,
                  ),
                ),
              ),
            ]),
            h(
              "tbody",
              kit.weeks.map((week, weekIndex) =>
                h(
                  "tr",
                  {
                    key: week.map((day) => day.date ?? day.label).join("-"),
                    class: kit.slots.weekClassName,
                  },
                  week.map((day: DatePickerDay, dayIndex: number) => {
                    const dayKit = kit.dayKits[weekIndex]?.[dayIndex]
                    if (!dayKit) return null
                    return h(
                      "td",
                      {
                        key: day.date ?? `${weekIndex}-${dayIndex}`,
                        class: kit.slots.cellClassName,
                      },
                      [
                        h(
                          "button",
                          {
                            type: "button",
                            ...dayKit.dataAttributes,
                            class: dayKit.className,
                            "aria-label": dayKit.ariaLabel,
                            "aria-pressed": dayKit.selected ? "true" : undefined,
                            disabled: dayKit.disabled,
                            onClick: () => emit("daySelect", day),
                          },
                          day.label,
                        ),
                      ],
                    )
                  }),
                ),
              ),
            ),
          ]),
          h("footer", { class: kit.slots.footerClassName }, [
            h(
              "button",
              {
                type: "button",
                class: kit.slots.footerButtonClassName,
                onClick: () => emit("cancel"),
              },
              kit.labels.cancel,
            ),
            kit.labels.apply
              ? h(
                  "button",
                  {
                    type: "button",
                    class: mergeClassNames(
                      kit.slots.footerButtonClassName,
                      "mw-date-picker__footer-button--primary",
                    ),
                    onClick: () => emit("apply"),
                  },
                  kit.labels.apply,
                )
              : null,
          ]),
        ],
      )
    }
  },
  {
    name: "MarwesDatePicker",
    inheritAttrs: false,
    props: [...datePickerPropKeys],
    emits: [
      "previousYear",
      "previousMonth",
      "nextMonth",
      "nextYear",
      "daySelect",
      "cancel",
      "apply",
    ],
  },
)
