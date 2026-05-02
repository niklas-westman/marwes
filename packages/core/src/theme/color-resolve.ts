import { adjustLightness, pickContrastColor, setAlpha } from "./color-utils"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ColorRole {
  base: string
  hover: string
  pressed: string
  disabled: string
  label: string
  labelDisabled: string
}

export interface SecondaryColorRole extends ColorRole {
  border: string
  borderDisabled: string
}

export type ColorInput =
  | string
  | {
      base: string
      hover?: string
      pressed?: string
      disabled?: string
      label?: string
      labelDisabled?: string
    }

// ─── resolveColorRole ────────────────────────────────────────────────────────

/**
 * Derives a full interaction palette from a single base hex color.
 * Hover/pressed shifts use OKLCH for perceptual uniformity (D1).
 * Label contrast uses WCAG relative luminance (D2).
 * Any field in `overrides` replaces the derived value for that field only.
 */
export function resolveColorRole(base: string, overrides?: Partial<ColorRole>): ColorRole {
  const isLight = pickContrastColor(base) === "#141414"
  const label = pickContrastColor(base)

  const derived: ColorRole = {
    base,
    hover: adjustLightness(base, isLight ? -0.08 : -0.1),
    pressed: adjustLightness(base, isLight ? -0.15 : -0.2),
    disabled: setAlpha(base, 0.35),
    label,
    labelDisabled: setAlpha(label, 0.5),
  }

  return overrides ? { ...derived, ...overrides } : derived
}

// ─── resolveSecondaryRole ─────────────────────────────────────────────────────

/**
 * Derives the outline/secondary role from the primary ColorRole (D4).
 * Secondary has a transparent base with alpha-tinted interaction states,
 * and extra border fields not present on a standard ColorRole.
 */
export function resolveSecondaryRole(primary: ColorRole): SecondaryColorRole {
  return {
    base: "transparent",
    hover: setAlpha(primary.base, 0.08),
    pressed: setAlpha(primary.base, 0.15),
    disabled: "transparent",
    label: primary.base,
    labelDisabled: setAlpha(primary.base, 0.5),
    border: primary.base,
    borderDisabled: primary.disabled,
  }
}

// ─── resolveInfoRole ──────────────────────────────────────────────────────────

/**
 * Info is a structural alias of primary (D3) — all fields mirror primary.
 */
export function resolveInfoRole(primary: ColorRole): ColorRole {
  return { ...primary }
}

// ─── normalizeColorInput ──────────────────────────────────────────────────────

/**
 * Accepts either a hex string or an override object and returns a resolved ColorRole.
 * String input is equivalent to resolveColorRole(string).
 * Object input passes all non-base fields as overrides to resolveColorRole.
 */
export function normalizeColorInput(input: ColorInput): ColorRole {
  if (typeof input === "string") {
    return resolveColorRole(input)
  }
  const { base, ...overrides } = input
  return resolveColorRole(base, overrides)
}
