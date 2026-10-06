import { defineHtmlAttributeMapper } from "../../../shared/html-attributes"
import type { HtmlAttributesOf } from "../../../shared/html-attributes"
import type { TabListA11yProps, TabPanelA11yProps } from "./tab-group-types"
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

const tabListHtmlAttributeNames = {
  id: "id",
  role: "role",
  ariaLabel: "aria-label",
  ariaLabelledBy: "aria-labelledby",
} as const

export type TabListHtmlAttributes = HtmlAttributesOf<
  TabListA11yProps,
  typeof tabListHtmlAttributeNames
>

/** Translates resolved tablist a11y fields into HTML attribute names. */
export const toTabListHtmlAttributes =
  defineHtmlAttributeMapper<TabListA11yProps>()(tabListHtmlAttributeNames)

const tabPanelHtmlAttributeNames = {
  id: "id",
  role: "role",
  ariaLabelledBy: "aria-labelledby",
  tabIndex: "tabindex",
  hidden: "hidden",
} as const

export type TabPanelHtmlAttributes = HtmlAttributesOf<
  TabPanelA11yProps,
  typeof tabPanelHtmlAttributeNames
>

/** Translates resolved tabpanel a11y fields into HTML attribute names. */
export const toTabPanelHtmlAttributes = defineHtmlAttributeMapper<TabPanelA11yProps>()(
  tabPanelHtmlAttributeNames,
)
