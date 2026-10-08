import { defineHtmlAttributeMapper } from "../../../shared/html-attributes"
import type { HtmlAttributesOf } from "../../../shared/html-attributes"
import type { SwitchA11yProps } from "./switch-types"

const switchHtmlAttributeNames = {
  role: "role",
  ariaChecked: "aria-checked",
  ariaDisabled: "aria-disabled",
  ariaInvalid: "aria-invalid",
  ariaLabel: "aria-label",
  ariaLabelledBy: "aria-labelledby",
  ariaDescribedBy: "aria-describedby",
} as const

export type SwitchHtmlAttributes = HtmlAttributesOf<
  SwitchA11yProps,
  typeof switchHtmlAttributeNames
>

/** Translates resolved switch a11y fields into HTML attribute names. */
export const toSwitchHtmlAttributes =
  defineHtmlAttributeMapper<SwitchA11yProps>()(switchHtmlAttributeNames)
