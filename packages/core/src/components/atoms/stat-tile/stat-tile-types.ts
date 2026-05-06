export type StatTileTone = "neutral" | "brand" | "success" | "warning" | "danger"
export type StatTileTrendDirection = "positive" | "negative"

export type StatTileDataAttributes = Record<string, string>

export interface StatTileOptions {
  tone?: StatTileTone
  trendDirection?: StatTileTrendDirection
  dataAttributes?: StatTileDataAttributes
}

export interface StatTileA11yProps {
  trendAriaLabel?: string
}

export interface StatTileRenderKit {
  tag: "article"
  className: string
  slots: {
    headerClassName: string
    labelClassName: string
    trendClassName: string
    trendIconClassName: string
    trendValueClassName: string
    valueClassName: string
    subtitleClassName: string
  }
  dataAttributes: StatTileDataAttributes
  trendDataAttributes: StatTileDataAttributes
  trendIcon: "↑" | "↓" | null
  a11y: StatTileA11yProps
}
