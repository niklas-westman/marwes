import { defineHtmlAttributeMapper } from "../../../shared/html-attributes"
import type { HtmlAttributesOf } from "../../../shared/html-attributes"
import type { DatePickerA11yProps } from "./date-picker-types"

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
