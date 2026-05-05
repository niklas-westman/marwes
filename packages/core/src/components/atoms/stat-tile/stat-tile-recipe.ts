import { resolveStatTileTrendLabel } from "./stat-tile-a11y"
import type { StatTileOptions, StatTileRenderKit, StatTileTone } from "./stat-tile-types"

const statTileTones = ["neutral", "brand", "success", "warning", "danger"] as const

function resolveTone(tone: StatTileTone | undefined): StatTileTone {
  return tone && statTileTones.includes(tone) ? tone : "neutral"
}

export function createStatTileRecipe(
  opts: StatTileOptions & { trendValue?: string } = {},
): StatTileRenderKit {
  const tone = resolveTone(opts.tone)
  const trendDirection = opts.trendDirection
  const trendClassName = [
    "mw-stat-tile__trend",
    trendDirection ? `mw-stat-tile__trend--${trendDirection}` : null,
  ]
    .filter(Boolean)
    .join(" ")

  const trendAriaLabel = resolveStatTileTrendLabel(trendDirection, opts.trendValue)

  return {
    tag: "article",
    className: ["mw-stat-tile", `mw-stat-tile--${tone}`].join(" "),
    slots: {
      headerClassName: "mw-stat-tile__header",
      labelClassName: "mw-stat-tile__label",
      trendClassName,
      trendIconClassName: "mw-stat-tile__trend-icon",
      trendValueClassName: "mw-stat-tile__trend-value",
      valueClassName: "mw-stat-tile__value",
      subtitleClassName: "mw-stat-tile__subtitle",
    },
    dataAttributes: {
      ...opts.dataAttributes,
      "data-component": "stat-tile",
      "data-tone": tone,
      ...(trendDirection ? { "data-trend": trendDirection } : {}),
    },
    trendDataAttributes: {
      "data-component": "stat-tile-trend",
      ...(trendDirection ? { "data-trend": trendDirection } : {}),
    },
    trendIcon: trendDirection === "positive" ? "↑" : trendDirection === "negative" ? "↓" : null,
    a11y: {
      ...(trendAriaLabel ? { trendAriaLabel } : {}),
    },
  }
}
