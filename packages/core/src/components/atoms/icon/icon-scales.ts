export const iconSizeScale = {
  xs: 16,
  sm: 24,
  md: 32,
  lg: 40,
} as const

export const iconStrokeWidthScale = {
  xs: 1,
  sm: 2,
  md: 3,
  lg: 4,
} as const

export type IconSizeKey = keyof typeof iconSizeScale
export type IconStrokeWidthKey = keyof typeof iconStrokeWidthScale

export function resolveIconSize(input: IconSizeKey | number): number {
  if (typeof input === "number") return input
  return iconSizeScale[input]
}

export function resolveIconStrokeWidth(input: IconStrokeWidthKey | number): number {
  if (typeof input === "number") return input
  return iconStrokeWidthScale[input]
}
