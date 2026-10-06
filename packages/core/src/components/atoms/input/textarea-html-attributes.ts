import { defineHtmlAttributeMapper } from "../../../shared/html-attributes"
import type { HtmlAttributesOf } from "../../../shared/html-attributes"
import type { TextareaA11yProps } from "./textarea-types"

const textareaHtmlAttributeNames = {
  id: "id",
  name: "name",
  disabled: "disabled",
  readOnly: "readonly",
  required: "required",
  inputMode: "inputmode",
  autoComplete: "autocomplete",
  placeholder: "placeholder",
  rows: "rows",
  cols: "cols",
  ariaLabel: "aria-label",
  ariaLabelledBy: "aria-labelledby",
  ariaInvalid: "aria-invalid",
  ariaDescribedBy: "aria-describedby",
} as const

export type TextareaHtmlAttributes = HtmlAttributesOf<
  TextareaA11yProps,
  typeof textareaHtmlAttributeNames
>

/** Translates resolved textarea a11y fields into HTML attribute names. */
export const toTextareaHtmlAttributes = defineHtmlAttributeMapper<TextareaA11yProps>()(
  textareaHtmlAttributeNames,
)
