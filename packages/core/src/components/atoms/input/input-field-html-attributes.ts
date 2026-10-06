import { defineHtmlAttributeMapper } from "../../../shared/html-attributes"
import type { HtmlAttributesOf } from "../../../shared/html-attributes"
import type { InputFieldActionA11yProps } from "./input-field-types"

const inputFieldActionHtmlAttributeNames = {
  ariaLabel: "aria-label",
} as const

export type InputFieldActionHtmlAttributes = HtmlAttributesOf<
  InputFieldActionA11yProps,
  typeof inputFieldActionHtmlAttributeNames
>

/** Translates resolved input field action a11y fields into HTML attribute names. */
export const toInputFieldActionHtmlAttributes =
  defineHtmlAttributeMapper<InputFieldActionA11yProps>()(inputFieldActionHtmlAttributeNames)
