import { defineHtmlAttributeMapper } from "../../../shared/html-attributes"
import type { HtmlAttributesOf } from "../../../shared/html-attributes"
import type { TabA11yProps } from "./tab-types"

const tabHtmlAttributeNames = {
  role: "role",
  ariaSelected: "aria-selected",
  ariaDisabled: "aria-disabled",
  tabIndex: "tabindex",
  ariaLabel: "aria-label",
  ariaControls: "aria-controls",
} as const

export type TabHtmlAttributes = HtmlAttributesOf<TabA11yProps, typeof tabHtmlAttributeNames>

/** Translates resolved tab a11y fields into HTML attribute names. */
export const toTabHtmlAttributes = defineHtmlAttributeMapper<TabA11yProps>()(tabHtmlAttributeNames)
