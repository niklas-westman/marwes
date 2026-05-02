import type { Density } from "./theme-types"

export interface DensityScale {
  height: number
  paddingX: number
  paddingY: number
  gap: number
  fontSize: number
  iconSize: number
  checkboxSize: number
  fieldGap: number
  spacingMultiplier: number
  fontSizeSm: number
}

export const DENSITY_SCALES: Record<Density, DensityScale> = {
  compact: {
    height: 34,
    paddingX: 10,
    paddingY: 6,
    gap: 4,
    fontSize: 13,
    iconSize: 16,
    checkboxSize: 16,
    fieldGap: 2,
    spacingMultiplier: 0.75,
    fontSizeSm: 12,
  },
  comfortable: {
    height: 40,
    paddingX: 16,
    paddingY: 12,
    gap: 8,
    fontSize: 14,
    iconSize: 20,
    checkboxSize: 18,
    fieldGap: 4,
    spacingMultiplier: 1,
    fontSizeSm: 13,
  },
  spacious: {
    height: 48,
    paddingX: 20,
    paddingY: 16,
    gap: 12,
    fontSize: 15,
    iconSize: 24,
    checkboxSize: 22,
    fieldGap: 6,
    spacingMultiplier: 1.25,
    fontSizeSm: 14,
  },
}

/**
 * Maps a density level to CSS custom properties.
 * These vars are consumed by preset CSS to control component sizing.
 */
export function densityToCSSVars(density: Density): Record<string, string> {
  const scale = DENSITY_SCALES[density]

  return {
    "--mw-density-height": `${scale.height}px`,
    "--mw-density-padding-x": `${scale.paddingX}px`,
    "--mw-density-padding-y": `${scale.paddingY}px`,
    "--mw-density-gap": `${scale.gap}px`,
    "--mw-density-font-size": `${scale.fontSize}px`,
    "--mw-density-icon-size": `${scale.iconSize}px`,
    "--mw-density-checkbox-size": `${scale.checkboxSize}px`,
    "--mw-density-field-gap": `${scale.fieldGap}px`,
    "--mw-density-spacing-multiplier": `${scale.spacingMultiplier}`,
    "--mw-density-font-size-sm": `${scale.fontSizeSm}px`,
  }
}
