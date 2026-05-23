// Re-export color role types so consumers import from one place
export type { ColorInput, ColorRole, SecondaryColorRole } from "./color-resolve"
export type { ToneName } from "./tone"

export type Density = "compact" | "comfortable" | "spacious"

/**
 * @deprecated UiVariant has been removed. Button variants (primary|secondary|text)
 * are unrelated. Remove any references to UiVariant from your code.
 */
export type UiVariant = "solid" | "soft" | "outline" | "ghost"

export type IconStrokeWidth = "xs" | "sm" | "md" | "lg"
export type IconSize = "xs" | "sm" | "md" | "lg"
export type HeadingSize = "h1" | "h2" | "h3"
export type ParagraphSize = "sm" | "md" | "lg"

export type StatusColorTokens = {
  background: string
  text: string
  icon: string
  border: string
  borderStrong: string
}

/**
 * Theme mode determines which default color palette is used.
 * - 'light': Uses light mode color defaults (dark text on light backgrounds)
 * - 'dark': Uses dark mode color defaults (light text on dark backgrounds)
 */
export const ThemeMode = {
  light: "light",
  dark: "dark",
} as const
export type ThemeMode = (typeof ThemeMode)[keyof typeof ThemeMode]
export type ThemePreference = ThemeMode | "system"
export type ThemeVariableStrategy = "inline" | "style-tag"
export type ThemeBreakpointName = "mobile" | "tablet" | "desktop" | "wideDesktop"
export type ThemeBreakpoints = Record<ThemeBreakpointName, number>

export const defaultThemeBreakpoints: ThemeBreakpoints = {
  mobile: 640,
  tablet: 900,
  desktop: 1200,
  wideDesktop: 1440,
}

export type Theme = {
  /**
   * The current theme mode. This determines which color defaults are applied.
   * Changing the mode will swap color values (e.g., surface ↔ surfaceInverted).
   */
  mode: ThemeMode

  color: {
    // Primary
    primary: string

    // Background & Surface
    background: string
    surface: string
    surfaceSubtle: string
    surfaceElevated: string
    surfaceDisabled: string
    surfaceInverted: string

    // Text
    text: string
    textMuted: string
    textSubtle: string
    textDisabled: string
    textInverted: string
    textBrand: string

    // Borders
    border: string
    borderSubtle: string
    borderStrong: string
    borderDisabled: string
    borderBrand: string

    /**
     * Focus color used for focus-visible outlines on interactive elements.
     * Defaults to the source focus ring token from docs/marwes-colors.json.
     */
    focus: string

    // Semantic colors
    danger: string
    success: string
    warning: string
    status: {
      success: StatusColorTokens
      warning: StatusColorTokens
      error: StatusColorTokens
      info: StatusColorTokens
    }
  }
  font: {
    primary: string
    secondary: string
    mono: string
  }
  ui: {
    radius: number
    density: Density
  }
  breakpoint: ThemeBreakpoints
  typography: {
    h1: {
      fontSize: number
      lineHeight: number
      fontWeight: number
      letterSpacing: number
    }
    h2: {
      fontSize: number
      lineHeight: number
      fontWeight: number
      letterSpacing: number
    }
    h3: {
      fontSize: number
      lineHeight: number
      fontWeight: number
      letterSpacing: number
    }
    paragraph: {
      sm: {
        fontSize: number
        lineHeight: number
      }
      md: {
        fontSize: number
        lineHeight: number
      }
      lg: {
        fontSize: number
        lineHeight: number
      }
    }
  }
}

// ─── V3 Input API ─────────────────────────────────────────────────────────────
// ThemeInput is the consumer-facing input type for the Phase 0 theme engine.
// Derivable roles (primary, danger, success, warning) accept ColorInput — a
// plain hex string or an override object. The on* fields and secondary are
// intentionally absent: they are derived automatically by resolveColorRole /
// resolveSecondaryRole. Object-form ColorInput is the sanctioned way to keep
// automatic role derivation while overriding fields such as label/labelDisabled
// for brand-specific filled surfaces.

import type { ColorInput } from "./color-resolve"
import type { ToneName } from "./tone"

export interface ThemeInputColor {
  primary: ColorInput
  danger: ColorInput
  success: ColorInput
  warning: ColorInput
  // Surface and semantic tokens — not derived, configured directly
  background: string
  surface: string
  surfaceSubtle: string
  surfaceElevated: string
  surfaceDisabled: string
  surfaceInverted: string
  text: string
  textMuted: string
  textSubtle: string
  textDisabled: string
  textInverted: string
  border: string
  borderSubtle: string
  borderStrong: string
  borderDisabled: string
  focus: string

  // Removed in v3 — typed never so consumers get a descriptive TS error
  /** @deprecated Removed in v3. Label color is now derived via WCAG contrast. Remove this field. */
  onPrimary?: never
  /** @deprecated Removed in v3. Secondary is always derived from primary. Remove this field. */
  secondary?: never
  onSecondary?: never
  onDanger?: never
  onSuccess?: never
  onWarning?: never
}

export interface ThemeInput {
  mode?: ThemeMode
  tone?: ToneName
  color?: Partial<ThemeInputColor>
  font?: Partial<Theme["font"]>
  ui?: Partial<Theme["ui"]>
  breakpoint?: Partial<ThemeBreakpoints>
  typography?: Partial<{
    h1?: Partial<Theme["typography"]["h1"]>
    h2?: Partial<Theme["typography"]["h2"]>
    h3?: Partial<Theme["typography"]["h3"]>
    paragraph?: Partial<{
      sm?: Partial<Theme["typography"]["paragraph"]["sm"]>
      md?: Partial<Theme["typography"]["paragraph"]["md"]>
      lg?: Partial<Theme["typography"]["paragraph"]["lg"]>
    }>
  }>
}
