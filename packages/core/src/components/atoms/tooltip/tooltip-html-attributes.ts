import { defineHtmlAttributeMapper } from "../../../shared/html-attributes"
import type { HtmlAttributesOf } from "../../../shared/html-attributes"
import type {
  TooltipA11yProps,
  TooltipGroupContentA11yProps,
  TooltipTriggerA11yProps,
} from "./tooltip-types"

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

const tooltipTriggerHtmlAttributeNames = {
  ariaLabel: "aria-label",
  ariaDescribedBy: "aria-describedby",
} as const

export type TooltipTriggerHtmlAttributes = HtmlAttributesOf<
  TooltipTriggerA11yProps,
  typeof tooltipTriggerHtmlAttributeNames
>

/** Translates resolved tooltip trigger a11y fields into HTML attribute names. */
export const toTooltipTriggerHtmlAttributes = defineHtmlAttributeMapper<TooltipTriggerA11yProps>()(
  tooltipTriggerHtmlAttributeNames,
)

const tooltipGroupContentHtmlAttributeNames = {
  ariaHidden: "aria-hidden",
} as const

export type TooltipGroupContentHtmlAttributes = HtmlAttributesOf<
  TooltipGroupContentA11yProps,
  typeof tooltipGroupContentHtmlAttributeNames
>

/** Translates tooltip group content a11y fields into HTML attribute names. */
export const toTooltipGroupContentHtmlAttributes =
  defineHtmlAttributeMapper<TooltipGroupContentA11yProps>()(tooltipGroupContentHtmlAttributeNames)
