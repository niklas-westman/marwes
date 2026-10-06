import { defineHtmlAttributeMapper } from "../../../shared/html-attributes"
import type { HtmlAttributesOf } from "../../../shared/html-attributes"
import type { CheckboxA11y, CheckboxGroupFieldA11yProps } from "./checkbox-types"

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

const checkboxGroupFieldHtmlAttributeNames = {
  ariaLabelledBy: "aria-labelledby",
  ariaDescribedBy: "aria-describedby",
  ariaInvalid: "aria-invalid",
  ariaRequired: "aria-required",
} as const

export type CheckboxGroupFieldHtmlAttributes = HtmlAttributesOf<
  CheckboxGroupFieldA11yProps,
  typeof checkboxGroupFieldHtmlAttributeNames
>

/** Translates resolved CheckboxGroupField wrapper a11y fields into HTML attribute names. */
export const toCheckboxGroupFieldHtmlAttributes =
  defineHtmlAttributeMapper<CheckboxGroupFieldA11yProps>()(checkboxGroupFieldHtmlAttributeNames)
