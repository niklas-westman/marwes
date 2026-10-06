import { defineHtmlAttributeMapper } from "../../../shared/html-attributes"
import type { HtmlAttributesOf } from "../../../shared/html-attributes"
import type { InputOtpA11yProps } from "./input-otp-types"

const inputOtpHtmlAttributeNames = {
  id: "id",
  name: "name",
  disabled: "disabled",
  readOnly: "readonly",
  required: "required",
  inputMode: "inputmode",
  autoComplete: "autocomplete",
  maxLength: "maxlength",
  pattern: "pattern",
  ariaLabel: "aria-label",
  ariaLabelledBy: "aria-labelledby",
  ariaInvalid: "aria-invalid",
  ariaDescribedBy: "aria-describedby",
} as const

export type InputOtpHtmlAttributes = HtmlAttributesOf<
  InputOtpA11yProps,
  typeof inputOtpHtmlAttributeNames
>

/** Translates resolved input otp a11y fields into HTML attribute names. */
export const toInputOtpHtmlAttributes = defineHtmlAttributeMapper<InputOtpA11yProps>()(
  inputOtpHtmlAttributeNames,
)
