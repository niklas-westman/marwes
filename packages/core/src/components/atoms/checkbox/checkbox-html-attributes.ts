import { defineHtmlAttributeMapper } from "../../../shared/html-attributes"
import type { HtmlAttributesOf } from "../../../shared/html-attributes"
import type { CheckboxA11y } from "./checkbox-types"

const checkboxHtmlAttributeNames = {
  type: "type",
  id: "id",
  name: "name",
  value: "value",
  disabled: "disabled",
  required: "required",
  ariaLabel: "aria-label",
  ariaLabelledBy: "aria-labelledby",
  ariaDescribedBy: "aria-describedby",
  ariaChecked: "aria-checked",
  ariaInvalid: "aria-invalid",
} as const

export type CheckboxHtmlAttributes = HtmlAttributesOf<
  CheckboxA11y,
  typeof checkboxHtmlAttributeNames
>

/** Translates resolved checkbox a11y fields into HTML attribute names. */
export const toCheckboxHtmlAttributes = defineHtmlAttributeMapper<CheckboxA11y>()(
  checkboxHtmlAttributeNames,
)
