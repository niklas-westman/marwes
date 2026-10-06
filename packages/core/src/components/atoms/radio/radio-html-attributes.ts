import { defineHtmlAttributeMapper } from "../../../shared/html-attributes"
import type { HtmlAttributesOf } from "../../../shared/html-attributes"
import type { RadioA11y, RadioGroupFieldA11yProps } from "./radio-types"

const radioHtmlAttributeNames = {
  type: "type",
  id: "id",
  name: "name",
  value: "value",
  disabled: "disabled",
  required: "required",
  ariaLabel: "aria-label",
  ariaLabelledBy: "aria-labelledby",
  ariaDescribedBy: "aria-describedby",
  ariaInvalid: "aria-invalid",
} as const

export type RadioHtmlAttributes = HtmlAttributesOf<RadioA11y, typeof radioHtmlAttributeNames>

/** Translates resolved radio a11y fields into HTML attribute names. */
export const toRadioHtmlAttributes = defineHtmlAttributeMapper<RadioA11y>()(radioHtmlAttributeNames)

const radioGroupFieldHtmlAttributeNames = {
  role: "role",
  ariaLabelledBy: "aria-labelledby",
  ariaDescribedBy: "aria-describedby",
  ariaInvalid: "aria-invalid",
  ariaRequired: "aria-required",
} as const

export type RadioGroupFieldHtmlAttributes = HtmlAttributesOf<
  RadioGroupFieldA11yProps,
  typeof radioGroupFieldHtmlAttributeNames
>

/** Translates resolved RadioGroupField wrapper a11y fields into HTML attribute names. */
export const toRadioGroupFieldHtmlAttributes =
  defineHtmlAttributeMapper<RadioGroupFieldA11yProps>()(radioGroupFieldHtmlAttributeNames)
