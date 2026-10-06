import { defineHtmlAttributeMapper } from "../../../shared/html-attributes"
import type { HtmlAttributesOf } from "../../../shared/html-attributes"
import type { SelectA11yProps } from "./select-types"

const selectHtmlAttributeNames = {
  id: "id",
  name: "name",
  disabled: "disabled",
  required: "required",
  ariaLabel: "aria-label",
  ariaLabelledBy: "aria-labelledby",
  ariaInvalid: "aria-invalid",
  ariaDescribedBy: "aria-describedby",
} as const

export type SelectHtmlAttributes = HtmlAttributesOf<
  SelectA11yProps,
  typeof selectHtmlAttributeNames
>

/** Translates resolved select a11y fields into HTML attribute names. */
export const toSelectHtmlAttributes =
  defineHtmlAttributeMapper<SelectA11yProps>()(selectHtmlAttributeNames)
