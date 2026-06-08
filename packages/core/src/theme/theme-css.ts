import type { ColorRole, SecondaryColorRole } from "./color-resolve"
import { densityToCSSVars } from "./density"
import type { TextVariant } from "./text-variant"
import { type StatusColorTokens, ThemeMode } from "./theme-types"
import type {
  Density,
  TextTypographyStyle,
  ThemeBreakpoints,
  ThemeMode as ThemeModeValue,
  TypographyStyle,
} from "./theme-types"

// ─── ResolvedTheme ────────────────────────────────────────────────────────────
// Post-derivation theme shape: color fields hold resolved ColorRole objects,
// not raw hex strings. Moved to theme-types.ts in Case 4.

export interface ResolvedTheme {
  mode: ThemeModeValue
  color: {
    primary: ColorRole
    secondary: SecondaryColorRole
    danger: ColorRole
    success: ColorRole
    warning: ColorRole
    info: ColorRole // always mirrors primary (D3)
    background: string
    surface: string
    surfacePrimary: string
    surfaceSubtle: string
    surfaceBrand: string
    surfaceElevated: string
    surfaceDisabled: string
    surfaceInverted: string
    text: string
    textMuted: string
    textSubtle: string
    textDisabled: string
    textInverted: string
    textBrand: string
    textLink: string
    iconMuted: string
    borderLow: string
    border: string
    borderSubtle: string
    borderStrong: string
    borderDisabled: string
    borderBrand: string
    borderFull: string
    focus: string
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
    display: TypographyStyle
    h1: TypographyStyle
    h2: TypographyStyle
    h3: TypographyStyle
    text: Record<TextVariant, TextTypographyStyle>
    paragraph: {
      sm: { fontSize: number; lineHeight: number }
      md: { fontSize: number; lineHeight: number }
      lg: { fontSize: number; lineHeight: number }
    }
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function colorRoleVars(role: string, cr: ColorRole): Record<string, string> {
  return {
    [`--mw-color-${role}-base`]: cr.base,
    [`--mw-color-${role}-hover`]: cr.hover,
    [`--mw-color-${role}-pressed`]: cr.pressed,
    [`--mw-color-${role}-disabled`]: cr.disabled,
    [`--mw-color-${role}-label`]: cr.label,
    [`--mw-color-${role}-label-disabled`]: cr.labelDisabled,
  }
}

function statusColorVars(role: string, tokens: StatusColorTokens): Record<string, string> {
  return {
    [`--mw-color-status-${role}-background`]: tokens.background,
    [`--mw-color-status-${role}-text`]: tokens.text,
    [`--mw-color-status-${role}-icon`]: tokens.icon,
    [`--mw-color-status-${role}-border`]: tokens.border,
    [`--mw-color-status-${role}-border-strong`]: tokens.borderStrong,
  }
}

function typographyStyleVars(prefix: string, style: TypographyStyle): Record<string, string> {
  return {
    [`${prefix}-font-size`]: `${style.fontSize}px`,
    [`${prefix}-line-height`]: `${style.lineHeight}`,
    [`${prefix}-font-weight`]: `${style.fontWeight}`,
    [`${prefix}-letter-spacing`]: `${style.letterSpacing}px`,
  }
}

function textTypographyStyleVars(
  variant: TextVariant,
  style: TextTypographyStyle,
): Record<string, string> {
  return {
    ...typographyStyleVars(`--mw-typography-text-${variant}`, style),
    [`--mw-typography-text-${variant}-transform`]: style.textTransform ?? "none",
  }
}

// ─── themeToCSSVars ───────────────────────────────────────────────────────────

/**
 * Maps every field of a resolved theme to its CSS custom property name.
 * Returns 148 entries total. `variant` is excluded — it is deprecated.
 * Density is emitted as 10 `--mw-density-*` vars via densityToCSSVars.
 *
 * Variable naming follows D11: --mw-color-{role}-{state}, --mw-font-*, etc.
 */
export function themeToCSSVars(theme: ResolvedTheme): Record<string, string> {
  const { color, font, ui, typography } = theme

  return {
    // Color roles: primary, danger, success, warning, info (5 × 6 = 30)
    ...colorRoleVars("primary", color.primary),
    ...colorRoleVars("danger", color.danger),
    ...colorRoleVars("success", color.success),
    ...colorRoleVars("warning", color.warning),
    ...colorRoleVars("info", color.info),

    // Secondary: 6 standard fields + 2 border fields (= 8)
    ...colorRoleVars("secondary", color.secondary),
    "--mw-color-secondary-border": color.secondary.border,
    "--mw-color-secondary-border-disabled": color.secondary.borderDisabled,

    // Surface / semantic neutrals (24)
    "--mw-color-background": color.background,
    "--mw-color-surface": color.surface,
    "--mw-color-surface-primary": color.surfacePrimary,
    "--mw-color-surface-subtle": color.surfaceSubtle,
    "--mw-color-surface-brand": color.surfaceBrand,
    "--mw-color-surface-elevated": color.surfaceElevated,
    "--mw-color-surface-disabled": color.surfaceDisabled,
    "--mw-color-surface-inverted": color.surfaceInverted,
    "--mw-color-text": color.text,
    "--mw-color-text-muted": color.textMuted,
    "--mw-color-text-subtle": color.textSubtle,
    "--mw-color-text-disabled": color.textDisabled,
    "--mw-color-text-inverted": color.textInverted,
    "--mw-color-text-brand": color.textBrand,
    "--mw-color-text-link": color.textLink,
    "--mw-color-icon-muted": color.iconMuted,
    "--mw-color-border-low": color.borderLow,
    "--mw-color-border": color.border,
    "--mw-color-border-subtle": color.borderSubtle,
    "--mw-color-border-strong": color.borderStrong,
    "--mw-color-border-disabled": color.borderDisabled,
    "--mw-color-border-brand": color.borderBrand,
    "--mw-color-border-full": color.borderFull,
    "--mw-color-focus": color.focus,

    // Status role tokens (4 × 5 = 20)
    ...statusColorVars("success", color.status.success),
    ...statusColorVars("warning", color.status.warning),
    ...statusColorVars("error", color.status.error),
    ...statusColorVars("info", color.status.info),

    // Font (3)
    "--mw-font-primary": font.primary,
    "--mw-font-secondary": font.secondary,
    "--mw-font-mono": font.mono,

    // UI (1)
    "--mw-ui-radius": `${ui.radius}px`,

    // Density (10)
    ...densityToCSSVars(ui.density),

    // Typography
    ...typographyStyleVars("--mw-typography-display", typography.display),
    ...typographyStyleVars("--mw-typography-h1", typography.h1),
    ...typographyStyleVars("--mw-typography-h2", typography.h2),
    ...typographyStyleVars("--mw-typography-h3", typography.h3),
    ...textTypographyStyleVars("display", typography.text.display),
    ...textTypographyStyleVars("label", typography.text.label),
    ...textTypographyStyleVars("label-small", typography.text["label-small"]),
    ...textTypographyStyleVars("caption", typography.text.caption),
    ...textTypographyStyleVars("overline", typography.text.overline),
    ...textTypographyStyleVars("micro", typography.text.micro),

    // Typography — paragraph (3 × 2 = 6)
    "--mw-typography-paragraph-sm-font-size": `${typography.paragraph.sm.fontSize}px`,
    "--mw-typography-paragraph-sm-line-height": `${typography.paragraph.sm.lineHeight}`,
    "--mw-typography-paragraph-md-font-size": `${typography.paragraph.md.fontSize}px`,
    "--mw-typography-paragraph-md-line-height": `${typography.paragraph.md.lineHeight}`,
    "--mw-typography-paragraph-lg-font-size": `${typography.paragraph.lg.fontSize}px`,
    "--mw-typography-paragraph-lg-line-height": `${typography.paragraph.lg.lineHeight}`,
  }
}

export type ThemeModeAttribute = "class" | "data-theme" | "data-mode"
export type ThemeModeRootTarget = "html" | "body"

export type ThemeModeCSSRulesOptions = {
  light: ResolvedTheme
  dark: ResolvedTheme
  selector?: string
  rootTarget?: ThemeModeRootTarget
  rootAttribute?: ThemeModeAttribute
}

const defaultThemeSelector = "[data-marwes-theme]"

export function themeToCSSRule(selector: string, theme: ResolvedTheme): string {
  const declarations = Object.entries(themeToCSSVars(theme))
    .map(([property, value]) => `  ${property}: ${serializeCSSDeclarationValue(value)};`)
    .join("\n")

  return `${selector} {\n${declarations}\n  background-color: var(--mw-color-background);\n  color: var(--mw-color-text);\n}`
}

export function themeModesToCSSRules({
  light,
  dark,
  selector = defaultThemeSelector,
  rootTarget,
  rootAttribute = "class",
}: ThemeModeCSSRulesOptions): string {
  return [
    themeToCSSRule(buildModeSelector(selector, ThemeMode.light, rootTarget, rootAttribute), light),
    themeToCSSRule(buildModeSelector(selector, ThemeMode.dark, rootTarget, rootAttribute), dark),
  ].join("\n\n")
}

function buildModeSelector(
  selector: string,
  mode: ThemeModeValue,
  rootTarget: ThemeModeRootTarget | undefined,
  rootAttribute: ThemeModeAttribute,
): string {
  const providerSelector = `${selector}[data-marwes-mode="${mode}"]`
  const rootSelector =
    rootTarget === undefined
      ? undefined
      : `${buildRootModeSelector(rootTarget, rootAttribute, mode)} ${selector}`

  return rootSelector === undefined ? providerSelector : `${providerSelector},\n${rootSelector}`
}

function buildRootModeSelector(
  target: ThemeModeRootTarget,
  attribute: ThemeModeAttribute,
  mode: ThemeModeValue,
): string {
  if (attribute === "class") return `${target}.${mode}`
  return `${target}[${attribute}="${mode}"]`
}

function serializeCSSDeclarationValue(value: string): string {
  return value.replace(/[\n\r\t]+/g, " ").replace(/[;{}]/g, "")
}
