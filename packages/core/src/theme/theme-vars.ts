import type { ResolvedTheme } from "./theme-css"
import { type ThemeBreakpoints, defaultThemeBreakpoints } from "./theme-types"

export type MwThemeVarName = `--mw-${string}`
export type MwThemeVarReference = `var(${MwThemeVarName})` | `var(${MwThemeVarName}, ${string})`
export type MwThemeMedia = {
  mobileAndAbove: string
  tabletAndAbove: string
  desktopAndAbove: string
  wideDesktopAndAbove: string
  mobileAndBelow: string
  tabletAndBelow: string
  desktopAndBelow: string
  wideDesktopAndBelow: string
}

/**
 * Wraps a Marwes CSS custom property name in `var(...)`, with an optional fallback.
 * Use this as the escape hatch for custom or advanced `--mw-*` variables.
 */
export function mwVar<const TName extends MwThemeVarName>(name: TName): `var(${TName})`
export function mwVar<const TName extends MwThemeVarName>(
  name: TName,
  fallback: string,
): `var(${TName}, ${string})`
export function mwVar(name: MwThemeVarName, fallback?: string): string {
  return fallback === undefined ? `var(${name})` : `var(${name}, ${fallback})`
}

export function createMwThemeMedia(breakpoint: ThemeBreakpoints): MwThemeMedia {
  return {
    mobileAndAbove: `@media (min-width: ${breakpoint.mobile}px)`,
    tabletAndAbove: `@media (min-width: ${breakpoint.tablet}px)`,
    desktopAndAbove: `@media (min-width: ${breakpoint.desktop}px)`,
    wideDesktopAndAbove: `@media (min-width: ${breakpoint.wideDesktop}px)`,
    mobileAndBelow: `@media (max-width: ${formatMaxBreakpoint(breakpoint.mobile)}px)`,
    tabletAndBelow: `@media (max-width: ${formatMaxBreakpoint(breakpoint.tablet)}px)`,
    desktopAndBelow: `@media (max-width: ${formatMaxBreakpoint(breakpoint.desktop)}px)`,
    wideDesktopAndBelow: `@media (max-width: ${formatMaxBreakpoint(breakpoint.wideDesktop)}px)`,
  }
}

function formatMaxBreakpoint(value: number): string {
  return `${Number((value - 0.02).toFixed(2))}`
}

/**
 * Raw Marwes CSS custom property names, without `var(...)`.
 * Use these when assigning variables, inspecting tokens, writing tests, or building adapter/tooling bridges.
 */
export const mwThemeVarNames = {
  color: {
    primary: {
      base: "--mw-color-primary-base",
      hover: "--mw-color-primary-hover",
      pressed: "--mw-color-primary-pressed",
      disabled: "--mw-color-primary-disabled",
      label: "--mw-color-primary-label",
      labelDisabled: "--mw-color-primary-label-disabled",
    },
    secondary: {
      base: "--mw-color-secondary-base",
      hover: "--mw-color-secondary-hover",
      pressed: "--mw-color-secondary-pressed",
      disabled: "--mw-color-secondary-disabled",
      label: "--mw-color-secondary-label",
      labelDisabled: "--mw-color-secondary-label-disabled",
      border: "--mw-color-secondary-border",
      borderDisabled: "--mw-color-secondary-border-disabled",
    },
    danger: {
      base: "--mw-color-danger-base",
      hover: "--mw-color-danger-hover",
      pressed: "--mw-color-danger-pressed",
      disabled: "--mw-color-danger-disabled",
      label: "--mw-color-danger-label",
      labelDisabled: "--mw-color-danger-label-disabled",
    },
    success: {
      base: "--mw-color-success-base",
      hover: "--mw-color-success-hover",
      pressed: "--mw-color-success-pressed",
      disabled: "--mw-color-success-disabled",
      label: "--mw-color-success-label",
      labelDisabled: "--mw-color-success-label-disabled",
    },
    warning: {
      base: "--mw-color-warning-base",
      hover: "--mw-color-warning-hover",
      pressed: "--mw-color-warning-pressed",
      disabled: "--mw-color-warning-disabled",
      label: "--mw-color-warning-label",
      labelDisabled: "--mw-color-warning-label-disabled",
    },
    info: {
      base: "--mw-color-info-base",
      hover: "--mw-color-info-hover",
      pressed: "--mw-color-info-pressed",
      disabled: "--mw-color-info-disabled",
      label: "--mw-color-info-label",
      labelDisabled: "--mw-color-info-label-disabled",
    },
    background: "--mw-color-background",
    surface: "--mw-color-surface",
    surfacePrimary: "--mw-color-surface-primary",
    surfaceSubtle: "--mw-color-surface-subtle",
    surfaceBrand: "--mw-color-surface-brand",
    surfaceElevated: "--mw-color-surface-elevated",
    surfaceDisabled: "--mw-color-surface-disabled",
    surfaceInverted: "--mw-color-surface-inverted",
    text: "--mw-color-text",
    textMuted: "--mw-color-text-muted",
    textSubtle: "--mw-color-text-subtle",
    textDisabled: "--mw-color-text-disabled",
    textInverted: "--mw-color-text-inverted",
    textBrand: "--mw-color-text-brand",
    textLink: "--mw-color-text-link",
    iconMuted: "--mw-color-icon-muted",
    border: "--mw-color-border",
    borderSubtle: "--mw-color-border-subtle",
    borderStrong: "--mw-color-border-strong",
    borderDisabled: "--mw-color-border-disabled",
    borderBrand: "--mw-color-border-brand",
    focus: "--mw-color-focus",
    status: {
      success: {
        background: "--mw-color-status-success-background",
        text: "--mw-color-status-success-text",
        icon: "--mw-color-status-success-icon",
        border: "--mw-color-status-success-border",
        borderStrong: "--mw-color-status-success-border-strong",
      },
      warning: {
        background: "--mw-color-status-warning-background",
        text: "--mw-color-status-warning-text",
        icon: "--mw-color-status-warning-icon",
        border: "--mw-color-status-warning-border",
        borderStrong: "--mw-color-status-warning-border-strong",
      },
      error: {
        background: "--mw-color-status-error-background",
        text: "--mw-color-status-error-text",
        icon: "--mw-color-status-error-icon",
        border: "--mw-color-status-error-border",
        borderStrong: "--mw-color-status-error-border-strong",
      },
      info: {
        background: "--mw-color-status-info-background",
        text: "--mw-color-status-info-text",
        icon: "--mw-color-status-info-icon",
        border: "--mw-color-status-info-border",
        borderStrong: "--mw-color-status-info-border-strong",
      },
    },
  },
  spacing: {
    sp0: "--mw-spacing-sp-0",
    sp2: "--mw-spacing-sp-2",
    sp4: "--mw-spacing-sp-4",
    sp8: "--mw-spacing-sp-8",
    sp16: "--mw-spacing-sp-16",
    sp24: "--mw-spacing-sp-24",
    sp32: "--mw-spacing-sp-32",
    sp40: "--mw-spacing-sp-40",
    sp48: "--mw-spacing-sp-48",
    sp56: "--mw-spacing-sp-56",
    sp64: "--mw-spacing-sp-64",
    sp72: "--mw-spacing-sp-72",
    sp80: "--mw-spacing-sp-80",
    sp88: "--mw-spacing-sp-88",
    sp96: "--mw-spacing-sp-96",
    sp104: "--mw-spacing-sp-104",
    sp112: "--mw-spacing-sp-112",
    sp120: "--mw-spacing-sp-120",
  },
  font: {
    primary: "--mw-font-primary",
    secondary: "--mw-font-secondary",
    mono: "--mw-font-mono",
  },
  ui: {
    radius: "--mw-ui-radius",
  },
  density: {
    height: "--mw-density-height",
    paddingX: "--mw-density-padding-x",
    paddingY: "--mw-density-padding-y",
    gap: "--mw-density-gap",
    fontSize: "--mw-density-font-size",
    iconSize: "--mw-density-icon-size",
    checkboxSize: "--mw-density-checkbox-size",
    fieldGap: "--mw-density-field-gap",
    spacingMultiplier: "--mw-density-spacing-multiplier",
    fontSizeSm: "--mw-density-font-size-sm",
  },
  typography: {
    display: {
      fontSize: "--mw-typography-display-font-size",
      lineHeight: "--mw-typography-display-line-height",
      fontWeight: "--mw-typography-display-font-weight",
      letterSpacing: "--mw-typography-display-letter-spacing",
    },
    h1: {
      fontSize: "--mw-typography-h1-font-size",
      lineHeight: "--mw-typography-h1-line-height",
      fontWeight: "--mw-typography-h1-font-weight",
      letterSpacing: "--mw-typography-h1-letter-spacing",
    },
    h2: {
      fontSize: "--mw-typography-h2-font-size",
      lineHeight: "--mw-typography-h2-line-height",
      fontWeight: "--mw-typography-h2-font-weight",
      letterSpacing: "--mw-typography-h2-letter-spacing",
    },
    h3: {
      fontSize: "--mw-typography-h3-font-size",
      lineHeight: "--mw-typography-h3-line-height",
      fontWeight: "--mw-typography-h3-font-weight",
      letterSpacing: "--mw-typography-h3-letter-spacing",
    },
    text: {
      display: {
        fontSize: "--mw-typography-text-display-font-size",
        lineHeight: "--mw-typography-text-display-line-height",
        fontWeight: "--mw-typography-text-display-font-weight",
        letterSpacing: "--mw-typography-text-display-letter-spacing",
        textTransform: "--mw-typography-text-display-transform",
      },
      label: {
        fontSize: "--mw-typography-text-label-font-size",
        lineHeight: "--mw-typography-text-label-line-height",
        fontWeight: "--mw-typography-text-label-font-weight",
        letterSpacing: "--mw-typography-text-label-letter-spacing",
        textTransform: "--mw-typography-text-label-transform",
      },
      "label-small": {
        fontSize: "--mw-typography-text-label-small-font-size",
        lineHeight: "--mw-typography-text-label-small-line-height",
        fontWeight: "--mw-typography-text-label-small-font-weight",
        letterSpacing: "--mw-typography-text-label-small-letter-spacing",
        textTransform: "--mw-typography-text-label-small-transform",
      },
      caption: {
        fontSize: "--mw-typography-text-caption-font-size",
        lineHeight: "--mw-typography-text-caption-line-height",
        fontWeight: "--mw-typography-text-caption-font-weight",
        letterSpacing: "--mw-typography-text-caption-letter-spacing",
        textTransform: "--mw-typography-text-caption-transform",
      },
      overline: {
        fontSize: "--mw-typography-text-overline-font-size",
        lineHeight: "--mw-typography-text-overline-line-height",
        fontWeight: "--mw-typography-text-overline-font-weight",
        letterSpacing: "--mw-typography-text-overline-letter-spacing",
        textTransform: "--mw-typography-text-overline-transform",
      },
      micro: {
        fontSize: "--mw-typography-text-micro-font-size",
        lineHeight: "--mw-typography-text-micro-line-height",
        fontWeight: "--mw-typography-text-micro-font-weight",
        letterSpacing: "--mw-typography-text-micro-letter-spacing",
        textTransform: "--mw-typography-text-micro-transform",
      },
    },
    paragraph: {
      sm: {
        fontSize: "--mw-typography-paragraph-sm-font-size",
        lineHeight: "--mw-typography-paragraph-sm-line-height",
      },
      md: {
        fontSize: "--mw-typography-paragraph-md-font-size",
        lineHeight: "--mw-typography-paragraph-md-line-height",
      },
      lg: {
        fontSize: "--mw-typography-paragraph-lg-font-size",
        lineHeight: "--mw-typography-paragraph-lg-line-height",
      },
    },
  },
} as const

/**
 * Marwes theme tokens as CSS `var(...)` references.
 * Use this as the default custom styling API for CSS-in-JS, style objects, config files, and framework adapters.
 */
export const mwThemeVars = {
  color: {
    primary: {
      base: "var(--mw-color-primary-base)",
      hover: "var(--mw-color-primary-hover)",
      pressed: "var(--mw-color-primary-pressed)",
      disabled: "var(--mw-color-primary-disabled)",
      label: "var(--mw-color-primary-label)",
      labelDisabled: "var(--mw-color-primary-label-disabled)",
    },
    secondary: {
      base: "var(--mw-color-secondary-base)",
      hover: "var(--mw-color-secondary-hover)",
      pressed: "var(--mw-color-secondary-pressed)",
      disabled: "var(--mw-color-secondary-disabled)",
      label: "var(--mw-color-secondary-label)",
      labelDisabled: "var(--mw-color-secondary-label-disabled)",
      border: "var(--mw-color-secondary-border)",
      borderDisabled: "var(--mw-color-secondary-border-disabled)",
    },
    danger: {
      base: "var(--mw-color-danger-base)",
      hover: "var(--mw-color-danger-hover)",
      pressed: "var(--mw-color-danger-pressed)",
      disabled: "var(--mw-color-danger-disabled)",
      label: "var(--mw-color-danger-label)",
      labelDisabled: "var(--mw-color-danger-label-disabled)",
    },
    success: {
      base: "var(--mw-color-success-base)",
      hover: "var(--mw-color-success-hover)",
      pressed: "var(--mw-color-success-pressed)",
      disabled: "var(--mw-color-success-disabled)",
      label: "var(--mw-color-success-label)",
      labelDisabled: "var(--mw-color-success-label-disabled)",
    },
    warning: {
      base: "var(--mw-color-warning-base)",
      hover: "var(--mw-color-warning-hover)",
      pressed: "var(--mw-color-warning-pressed)",
      disabled: "var(--mw-color-warning-disabled)",
      label: "var(--mw-color-warning-label)",
      labelDisabled: "var(--mw-color-warning-label-disabled)",
    },
    info: {
      base: "var(--mw-color-info-base)",
      hover: "var(--mw-color-info-hover)",
      pressed: "var(--mw-color-info-pressed)",
      disabled: "var(--mw-color-info-disabled)",
      label: "var(--mw-color-info-label)",
      labelDisabled: "var(--mw-color-info-label-disabled)",
    },
    background: "var(--mw-color-background)",
    surface: "var(--mw-color-surface)",
    surfacePrimary: "var(--mw-color-surface-primary)",
    surfaceSubtle: "var(--mw-color-surface-subtle)",
    surfaceBrand: "var(--mw-color-surface-brand)",
    surfaceElevated: "var(--mw-color-surface-elevated)",
    surfaceDisabled: "var(--mw-color-surface-disabled)",
    surfaceInverted: "var(--mw-color-surface-inverted)",
    text: "var(--mw-color-text)",
    textMuted: "var(--mw-color-text-muted)",
    textSubtle: "var(--mw-color-text-subtle)",
    textDisabled: "var(--mw-color-text-disabled)",
    textInverted: "var(--mw-color-text-inverted)",
    textBrand: "var(--mw-color-text-brand)",
    textLink: "var(--mw-color-text-link)",
    iconMuted: "var(--mw-color-icon-muted)",
    border: "var(--mw-color-border)",
    borderSubtle: "var(--mw-color-border-subtle)",
    borderStrong: "var(--mw-color-border-strong)",
    borderDisabled: "var(--mw-color-border-disabled)",
    borderBrand: "var(--mw-color-border-brand)",
    focus: "var(--mw-color-focus)",
    status: {
      success: {
        background: "var(--mw-color-status-success-background)",
        text: "var(--mw-color-status-success-text)",
        icon: "var(--mw-color-status-success-icon)",
        border: "var(--mw-color-status-success-border)",
        borderStrong: "var(--mw-color-status-success-border-strong)",
      },
      warning: {
        background: "var(--mw-color-status-warning-background)",
        text: "var(--mw-color-status-warning-text)",
        icon: "var(--mw-color-status-warning-icon)",
        border: "var(--mw-color-status-warning-border)",
        borderStrong: "var(--mw-color-status-warning-border-strong)",
      },
      error: {
        background: "var(--mw-color-status-error-background)",
        text: "var(--mw-color-status-error-text)",
        icon: "var(--mw-color-status-error-icon)",
        border: "var(--mw-color-status-error-border)",
        borderStrong: "var(--mw-color-status-error-border-strong)",
      },
      info: {
        background: "var(--mw-color-status-info-background)",
        text: "var(--mw-color-status-info-text)",
        icon: "var(--mw-color-status-info-icon)",
        border: "var(--mw-color-status-info-border)",
        borderStrong: "var(--mw-color-status-info-border-strong)",
      },
    },
  },
  spacing: {
    sp0: "var(--mw-spacing-sp-0)",
    sp2: "var(--mw-spacing-sp-2)",
    sp4: "var(--mw-spacing-sp-4)",
    sp8: "var(--mw-spacing-sp-8)",
    sp16: "var(--mw-spacing-sp-16)",
    sp24: "var(--mw-spacing-sp-24)",
    sp32: "var(--mw-spacing-sp-32)",
    sp40: "var(--mw-spacing-sp-40)",
    sp48: "var(--mw-spacing-sp-48)",
    sp56: "var(--mw-spacing-sp-56)",
    sp64: "var(--mw-spacing-sp-64)",
    sp72: "var(--mw-spacing-sp-72)",
    sp80: "var(--mw-spacing-sp-80)",
    sp88: "var(--mw-spacing-sp-88)",
    sp96: "var(--mw-spacing-sp-96)",
    sp104: "var(--mw-spacing-sp-104)",
    sp112: "var(--mw-spacing-sp-112)",
    sp120: "var(--mw-spacing-sp-120)",
  },
  font: {
    primary: "var(--mw-font-primary)",
    secondary: "var(--mw-font-secondary)",
    mono: "var(--mw-font-mono)",
  },
  ui: {
    radius: "var(--mw-ui-radius)",
  },
  density: {
    height: "var(--mw-density-height)",
    paddingX: "var(--mw-density-padding-x)",
    paddingY: "var(--mw-density-padding-y)",
    gap: "var(--mw-density-gap)",
    fontSize: "var(--mw-density-font-size)",
    iconSize: "var(--mw-density-icon-size)",
    checkboxSize: "var(--mw-density-checkbox-size)",
    fieldGap: "var(--mw-density-field-gap)",
    spacingMultiplier: "var(--mw-density-spacing-multiplier)",
    fontSizeSm: "var(--mw-density-font-size-sm)",
  },
  typography: {
    display: {
      fontSize: "var(--mw-typography-display-font-size)",
      lineHeight: "var(--mw-typography-display-line-height)",
      fontWeight: "var(--mw-typography-display-font-weight)",
      letterSpacing: "var(--mw-typography-display-letter-spacing)",
    },
    h1: {
      fontSize: "var(--mw-typography-h1-font-size)",
      lineHeight: "var(--mw-typography-h1-line-height)",
      fontWeight: "var(--mw-typography-h1-font-weight)",
      letterSpacing: "var(--mw-typography-h1-letter-spacing)",
    },
    h2: {
      fontSize: "var(--mw-typography-h2-font-size)",
      lineHeight: "var(--mw-typography-h2-line-height)",
      fontWeight: "var(--mw-typography-h2-font-weight)",
      letterSpacing: "var(--mw-typography-h2-letter-spacing)",
    },
    h3: {
      fontSize: "var(--mw-typography-h3-font-size)",
      lineHeight: "var(--mw-typography-h3-line-height)",
      fontWeight: "var(--mw-typography-h3-font-weight)",
      letterSpacing: "var(--mw-typography-h3-letter-spacing)",
    },
    text: {
      display: {
        fontSize: "var(--mw-typography-text-display-font-size)",
        lineHeight: "var(--mw-typography-text-display-line-height)",
        fontWeight: "var(--mw-typography-text-display-font-weight)",
        letterSpacing: "var(--mw-typography-text-display-letter-spacing)",
        textTransform: "var(--mw-typography-text-display-transform)",
      },
      label: {
        fontSize: "var(--mw-typography-text-label-font-size)",
        lineHeight: "var(--mw-typography-text-label-line-height)",
        fontWeight: "var(--mw-typography-text-label-font-weight)",
        letterSpacing: "var(--mw-typography-text-label-letter-spacing)",
        textTransform: "var(--mw-typography-text-label-transform)",
      },
      "label-small": {
        fontSize: "var(--mw-typography-text-label-small-font-size)",
        lineHeight: "var(--mw-typography-text-label-small-line-height)",
        fontWeight: "var(--mw-typography-text-label-small-font-weight)",
        letterSpacing: "var(--mw-typography-text-label-small-letter-spacing)",
        textTransform: "var(--mw-typography-text-label-small-transform)",
      },
      caption: {
        fontSize: "var(--mw-typography-text-caption-font-size)",
        lineHeight: "var(--mw-typography-text-caption-line-height)",
        fontWeight: "var(--mw-typography-text-caption-font-weight)",
        letterSpacing: "var(--mw-typography-text-caption-letter-spacing)",
        textTransform: "var(--mw-typography-text-caption-transform)",
      },
      overline: {
        fontSize: "var(--mw-typography-text-overline-font-size)",
        lineHeight: "var(--mw-typography-text-overline-line-height)",
        fontWeight: "var(--mw-typography-text-overline-font-weight)",
        letterSpacing: "var(--mw-typography-text-overline-letter-spacing)",
        textTransform: "var(--mw-typography-text-overline-transform)",
      },
      micro: {
        fontSize: "var(--mw-typography-text-micro-font-size)",
        lineHeight: "var(--mw-typography-text-micro-line-height)",
        fontWeight: "var(--mw-typography-text-micro-font-weight)",
        letterSpacing: "var(--mw-typography-text-micro-letter-spacing)",
        textTransform: "var(--mw-typography-text-micro-transform)",
      },
    },
    paragraph: {
      sm: {
        fontSize: "var(--mw-typography-paragraph-sm-font-size)",
        lineHeight: "var(--mw-typography-paragraph-sm-line-height)",
      },
      md: {
        fontSize: "var(--mw-typography-paragraph-md-font-size)",
        lineHeight: "var(--mw-typography-paragraph-md-line-height)",
      },
      lg: {
        fontSize: "var(--mw-typography-paragraph-lg-font-size)",
        lineHeight: "var(--mw-typography-paragraph-lg-line-height)",
      },
    },
  },
} as const

/**
 * Creates a ThemeProvider-friendly object for styled-components, Emotion, and other CSS providers.
 * Token values are CSS custom property references; media helpers are derived from the resolved theme.
 */
export function createMwTheme(theme: ResolvedTheme): MwTheme {
  return {
    ...mwThemeVars,
    breakpoint: theme.breakpoint,
    media: createMwThemeMedia(theme.breakpoint),
  }
}

/**
 * Static CSS-provider theme using default Marwes breakpoint values.
 * Use provider-rendered `mwTheme` when consumers need breakpoint overrides.
 */
export const mwTheme: MwTheme = {
  ...mwThemeVars,
  breakpoint: defaultThemeBreakpoints,
  media: createMwThemeMedia(defaultThemeBreakpoints),
}

/**
 * @deprecated Use `mwTheme`. This alias is kept for existing styled-provider consumers.
 */
export const mwStyledTheme = mwTheme

export type MwThemeVarNames = typeof mwThemeVarNames
export type MwThemeVars = typeof mwThemeVars
export type MwTheme = MwThemeVars & {
  breakpoint: ThemeBreakpoints
  media: MwThemeMedia
}
export type MwStyledTheme = typeof mwStyledTheme
