import { defineHtmlAttributeMapper } from "../../../shared/html-attributes"
import type { HtmlAttributesOf } from "../../../shared/html-attributes"
import type { TooltipA11yProps } from "./tooltip-types"

const tooltipHtmlAttributeNames = {
  id: "id",
  role: "role",
} as const

export type TooltipHtmlAttributes = HtmlAttributesOf<
  TooltipA11yProps,
  typeof tooltipHtmlAttributeNames
>

/** Translates resolved tooltip a11y fields into HTML attribute names. */
export const toTooltipHtmlAttributes =
  defineHtmlAttributeMapper<TooltipA11yProps>()(tooltipHtmlAttributeNames)
