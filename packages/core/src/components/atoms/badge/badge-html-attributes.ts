import { defineHtmlAttributeMapper } from "../../../shared/html-attributes"
import type { HtmlAttributesOf } from "../../../shared/html-attributes"
import type { BadgeGroupA11yProps } from "./badge-group-types"
import type { BadgeA11yProps } from "./badge-types"

const badgeHtmlAttributeNames = {
  ariaLabel: "aria-label",
} as const

export type BadgeHtmlAttributes = HtmlAttributesOf<BadgeA11yProps, typeof badgeHtmlAttributeNames>

/** Translates resolved badge a11y fields into HTML attribute names. */
export const toBadgeHtmlAttributes =
  defineHtmlAttributeMapper<BadgeA11yProps>()(badgeHtmlAttributeNames)

const badgeGroupHtmlAttributeNames = {
  ariaLabelledBy: "aria-labelledby",
} as const

export type BadgeGroupHtmlAttributes = HtmlAttributesOf<
  BadgeGroupA11yProps,
  typeof badgeGroupHtmlAttributeNames
>

/** Translates resolved badge group a11y fields into HTML attribute names. */
export const toBadgeGroupHtmlAttributes = defineHtmlAttributeMapper<BadgeGroupA11yProps>()(
  badgeGroupHtmlAttributeNames,
)
