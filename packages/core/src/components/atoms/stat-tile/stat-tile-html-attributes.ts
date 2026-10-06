import { defineHtmlAttributeMapper } from "../../../shared/html-attributes"
import type { HtmlAttributesOf } from "../../../shared/html-attributes"
import type { StatTileA11yProps } from "./stat-tile-types"

const statTileTrendHtmlAttributeNames = {
  trendAriaLabel: "aria-label",
} as const

export type StatTileTrendHtmlAttributes = HtmlAttributesOf<
  StatTileA11yProps,
  typeof statTileTrendHtmlAttributeNames
>

/** Translates resolved stat tile trend a11y fields into HTML attribute names. */
export const toStatTileTrendHtmlAttributes = defineHtmlAttributeMapper<StatTileA11yProps>()(
  statTileTrendHtmlAttributeNames,
)
