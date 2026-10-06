import { defineHtmlAttributeMapper } from "../../../shared/html-attributes"
import type { HtmlAttributesOf } from "../../../shared/html-attributes"
import type { ButtonA11yProps } from "./button-types"

const buttonHtmlAttributeNames = {
  ariaLabel: "aria-label",
  ariaLabelledBy: "aria-labelledby",
  ariaBusy: "aria-busy",
  ariaDisabled: "aria-disabled",
  ariaPressed: "aria-pressed",
  ariaExpanded: "aria-expanded",
  ariaControls: "aria-controls",
  title: "title",
  disabled: "disabled",
  type: "type",
  href: "href",
  role: "role",
  tabIndex: "tabindex",
} as const

export type ButtonHtmlAttributes = HtmlAttributesOf<
  ButtonA11yProps,
  typeof buttonHtmlAttributeNames
>

/** Translates resolved button a11y fields into HTML attribute names (lowercase `tabindex`). */
export const toButtonHtmlAttributes =
  defineHtmlAttributeMapper<ButtonA11yProps>()(buttonHtmlAttributeNames)
