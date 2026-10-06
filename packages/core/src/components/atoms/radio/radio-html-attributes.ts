import { defineHtmlAttributeMapper } from "../../../shared/html-attributes"
import type { HtmlAttributesOf } from "../../../shared/html-attributes"
import type { RadioA11y } from "./radio-types"

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
