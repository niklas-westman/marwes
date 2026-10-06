import { defineHtmlAttributeMapper } from "../../../shared/html-attributes"
import type { HtmlAttributesOf } from "../../../shared/html-attributes"
import type { InputA11yProps } from "./input-types"

const inputHtmlAttributeNames = {
  id: "id",
  name: "name",
  disabled: "disabled",
  readOnly: "readonly",
  required: "required",
  type: "type",
  inputMode: "inputmode",
  autoComplete: "autocomplete",
  placeholder: "placeholder",
  ariaLabel: "aria-label",
  ariaLabelledBy: "aria-labelledby",
  ariaInvalid: "aria-invalid",
  ariaDescribedBy: "aria-describedby",
} as const

export type InputHtmlAttributes = HtmlAttributesOf<InputA11yProps, typeof inputHtmlAttributeNames>

/** Translates resolved input a11y fields into HTML attribute names. */
export const toInputHtmlAttributes =
  defineHtmlAttributeMapper<InputA11yProps>()(inputHtmlAttributeNames)
