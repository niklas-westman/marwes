import type { StatTileTrendDirection } from "./stat-tile-types"

export function resolveStatTileTrendLabel(
  direction: StatTileTrendDirection | undefined,
  trendValue: string | undefined,
): string | undefined {
  if (!direction || !trendValue) return undefined
  return direction === "positive" ? `Increased by ${trendValue}` : `Decreased by ${trendValue}`
}
