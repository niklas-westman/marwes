import { defineHtmlAttributeMapper } from "../../../shared/html-attributes"
import type { HtmlAttributesOf } from "../../../shared/html-attributes"
import type { IconA11yProps } from "./icon-types"

const iconHtmlAttributeNames = {
  role: "role",
  ariaLabel: "aria-label",
  ariaHidden: "aria-hidden",
} as const

export type IconHtmlAttributes = HtmlAttributesOf<IconA11yProps, typeof iconHtmlAttributeNames>

/** Translates resolved icon a11y fields into HTML attribute names. */
export const toIconHtmlAttributes =
  defineHtmlAttributeMapper<IconA11yProps>()(iconHtmlAttributeNames)
