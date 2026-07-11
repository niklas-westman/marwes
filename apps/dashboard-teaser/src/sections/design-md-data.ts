import type { ThemeMode as ThemeModeValue } from "@marwes-ui/react"

type BaselineColorRoles = {
  background: string
  surface: string
  surfaceElevated: string
  text: string
  textMuted: string
  border: string
  borderStrong: string
  focus: string
  textInverted: string
}

/**
 * Baseline color roles for modes when a preset does not supply an override.
 * Kept in sync with firstEdition light/dark defaults in
 * packages/core/src/theme/theme-defaults.ts. Values here only cover the
 * roles surfaced in the exported DESIGN.md; adding a new exported role
 * means adding it here too.
 */
const baselineColorsByMode: Record<ThemeModeValue, BaselineColorRoles> = {
  light: {
    background: "#FFFFFF",
    surface: "#F8F8F8",
    surfaceElevated: "#FFFFFF",
    text: "#141414",
    textMuted: "#595959",
    border: "#D8D8D8",
    borderStrong: "#A3A3A3",
    focus: "#2F31FC",
    textInverted: "#FFFFFF",
  },
  dark: {
    background: "#0F0F0F",
    surface: "#1A1A1A",
    surfaceElevated: "#2B2B2B",
    text: "#F9FAFB",
    textMuted: "#A3A3A3",
    border: "#474747",
    borderStrong: "#A3A3A3",
    focus: "#8182FC",
    textInverted: "#141414",
  },
}

/**
 * Marwes typography metrics (identical in light and dark). Naming follows
 * Marwes' own token names (display / h1 / h2 / h3 / text-* / paragraph-*),
 * intentionally NOT design.md's recommended vocabulary — the user wants a
 * 1:1 map so future imports and Marwes-native tooling can round-trip.
 */
type TypographyMetric = {
  fontSize: number
  lineHeight: number
  fontWeight: number
  letterSpacing: number
  textTransform?: "uppercase"
}

const marwesTypography: Record<string, TypographyMetric> = {
  display: { fontSize: 44, lineHeight: 1.1818181818, fontWeight: 700, letterSpacing: -1.32 },
  h1: { fontSize: 32, lineHeight: 1.1875, fontWeight: 700, letterSpacing: -0.96 },
  h2: { fontSize: 24, lineHeight: 1.25, fontWeight: 500, letterSpacing: -0.72 },
  h3: { fontSize: 20, lineHeight: 1.3, fontWeight: 500, letterSpacing: -0.6 },
  "paragraph-lg": { fontSize: 18, lineHeight: 1.7, fontWeight: 400, letterSpacing: 0 },
  "paragraph-md": { fontSize: 16, lineHeight: 1.6, fontWeight: 400, letterSpacing: 0 },
  "paragraph-sm": { fontSize: 14, lineHeight: 1.5, fontWeight: 400, letterSpacing: 0 },
  "text-label": { fontSize: 14, lineHeight: 1.1428571429, fontWeight: 500, letterSpacing: -0.42 },
  "text-label-small": {
    fontSize: 12,
    lineHeight: 1,
    fontWeight: 500,
    letterSpacing: -0.36,
  },
  "text-caption": { fontSize: 12, lineHeight: 1.3333333333, fontWeight: 500, letterSpacing: 0 },
  "text-overline": {
    fontSize: 11,
    lineHeight: 1.4545454545,
    fontWeight: 500,
    letterSpacing: 0.88,
    textTransform: "uppercase",
  },
  "text-micro": { fontSize: 11, lineHeight: 1.2727272727, fontWeight: 400, letterSpacing: -0.33 },
}

export { baselineColorsByMode, marwesTypography }
export type { BaselineColorRoles, TypographyMetric }
