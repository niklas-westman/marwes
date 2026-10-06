import { defineHtmlAttributeMapper } from "../../../shared/html-attributes"
import type { HtmlAttributesOf } from "../../../shared/html-attributes"
import type { BadgeA11yProps } from "./badge-types"

const badgeHtmlAttributeNames = {
  ariaLabel: "aria-label",
} as const

export type BadgeHtmlAttributes = HtmlAttributesOf<BadgeA11yProps, typeof badgeHtmlAttributeNames>

/** Translates resolved badge a11y fields into HTML attribute names. */
export const toBadgeHtmlAttributes =
  defineHtmlAttributeMapper<BadgeA11yProps>()(badgeHtmlAttributeNames)
