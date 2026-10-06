import { defineHtmlAttributeMapper } from "../../../shared/html-attributes"
import type { HtmlAttributesOf } from "../../../shared/html-attributes"
import type {
  DatePickerA11yProps,
  DatePickerDayA11yProps,
  DatePickerGridA11yProps,
  DatePickerNavButtonA11yProps,
} from "./date-picker-types"

const datePickerHtmlAttributeNames = {
  ariaLabel: "aria-label",
  ariaLabelledBy: "aria-labelledby",
  ariaDescribedBy: "aria-describedby",
} as const

export type DatePickerHtmlAttributes = HtmlAttributesOf<
  DatePickerA11yProps,
  typeof datePickerHtmlAttributeNames
>

/** Translates resolved date picker a11y fields into HTML attribute names. */
export const toDatePickerHtmlAttributes = defineHtmlAttributeMapper<DatePickerA11yProps>()(
  datePickerHtmlAttributeNames,
)

const datePickerNavButtonHtmlAttributeNames = {
  ariaLabel: "aria-label",
} as const

export type DatePickerNavButtonHtmlAttributes = HtmlAttributesOf<
  DatePickerNavButtonA11yProps,
  typeof datePickerNavButtonHtmlAttributeNames
>

/** Translates resolved date picker navigation button a11y fields into HTML attribute names. */
export const toDatePickerNavButtonHtmlAttributes =
  defineHtmlAttributeMapper<DatePickerNavButtonA11yProps>()(datePickerNavButtonHtmlAttributeNames)

const datePickerGridHtmlAttributeNames = {
  ariaLabel: "aria-label",
} as const

export type DatePickerGridHtmlAttributes = HtmlAttributesOf<
  DatePickerGridA11yProps,
  typeof datePickerGridHtmlAttributeNames
>

/** Translates resolved date picker grid a11y fields into HTML attribute names. */
export const toDatePickerGridHtmlAttributes = defineHtmlAttributeMapper<DatePickerGridA11yProps>()(
  datePickerGridHtmlAttributeNames,
)

const datePickerDayHtmlAttributeNames = {
  ariaLabel: "aria-label",
  ariaPressed: "aria-pressed",
  ariaHidden: "aria-hidden",
} as const

export type DatePickerDayHtmlAttributes = HtmlAttributesOf<
  DatePickerDayA11yProps,
  typeof datePickerDayHtmlAttributeNames
>

/** Translates resolved date picker day a11y fields into HTML attribute names. */
export const toDatePickerDayHtmlAttributes = defineHtmlAttributeMapper<DatePickerDayA11yProps>()(
  datePickerDayHtmlAttributeNames,
)
