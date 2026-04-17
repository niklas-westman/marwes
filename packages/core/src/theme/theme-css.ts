import type { ColorRole, SecondaryColorRole } from "./color-resolve"
import { densityToCSSVars } from "./density"
import type { Density } from "./theme-types"

// ─── ResolvedTheme ────────────────────────────────────────────────────────────
// Post-derivation theme shape: color fields hold resolved ColorRole objects,
// not raw hex strings. Moved to theme-types.ts in Case 4.

export interface ResolvedTheme {
  color: {
    primary: ColorRole
    secondary: SecondaryColorRole
    danger: ColorRole
    success: ColorRole
    warning: ColorRole
    info: ColorRole // always mirrors primary (D3)
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
  typography: {
    h1: { fontSize: number; lineHeight: number; fontWeight: number; letterSpacing: number }
    h2: { fontSize: number; lineHeight: number; fontWeight: number; letterSpacing: number }
    h3: { fontSize: number; lineHeight: number; fontWeight: number; letterSpacing: number }
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

// ─── themeToCSSVars ───────────────────────────────────────────────────────────

/**
 * Maps every field of a resolved theme to its CSS custom property name.
 * Returns 86 entries total. `variant` is excluded — it is deprecated.
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

    // Surface / semantic neutrals (16)
    "--mw-color-background": color.background,
    "--mw-color-surface": color.surface,
    "--mw-color-surface-subtle": color.surfaceSubtle,
    "--mw-color-surface-elevated": color.surfaceElevated,
    "--mw-color-surface-disabled": color.surfaceDisabled,
    "--mw-color-surface-inverted": color.surfaceInverted,
    "--mw-color-text": color.text,
    "--mw-color-text-muted": color.textMuted,
    "--mw-color-text-subtle": color.textSubtle,
    "--mw-color-text-disabled": color.textDisabled,
    "--mw-color-text-inverted": color.textInverted,
    "--mw-color-border": color.border,
    "--mw-color-border-subtle": color.borderSubtle,
    "--mw-color-border-strong": color.borderStrong,
    "--mw-color-border-disabled": color.borderDisabled,
    "--mw-color-focus": color.focus,

    // Font (3)
    "--mw-font-primary": font.primary,
    "--mw-font-secondary": font.secondary,
    "--mw-font-mono": font.mono,

    // UI (1)
    "--mw-ui-radius": `${ui.radius}px`,

    // Density (10)
    ...densityToCSSVars(ui.density),

    // Typography — headings (3 × 4 = 12)
    "--mw-typography-h1-font-size": `${typography.h1.fontSize}px`,
    "--mw-typography-h1-line-height": `${typography.h1.lineHeight}`,
    "--mw-typography-h1-font-weight": `${typography.h1.fontWeight}`,
    "--mw-typography-h1-letter-spacing": `${typography.h1.letterSpacing}px`,

    "--mw-typography-h2-font-size": `${typography.h2.fontSize}px`,
    "--mw-typography-h2-line-height": `${typography.h2.lineHeight}`,
    "--mw-typography-h2-font-weight": `${typography.h2.fontWeight}`,
    "--mw-typography-h2-letter-spacing": `${typography.h2.letterSpacing}px`,

    "--mw-typography-h3-font-size": `${typography.h3.fontSize}px`,
    "--mw-typography-h3-line-height": `${typography.h3.lineHeight}`,
    "--mw-typography-h3-font-weight": `${typography.h3.fontWeight}`,
    "--mw-typography-h3-letter-spacing": `${typography.h3.letterSpacing}px`,

    // Typography — paragraph (3 × 2 = 6)
    "--mw-typography-paragraph-sm-font-size": `${typography.paragraph.sm.fontSize}px`,
    "--mw-typography-paragraph-sm-line-height": `${typography.paragraph.sm.lineHeight}`,
    "--mw-typography-paragraph-md-font-size": `${typography.paragraph.md.fontSize}px`,
    "--mw-typography-paragraph-md-line-height": `${typography.paragraph.md.lineHeight}`,
    "--mw-typography-paragraph-lg-font-size": `${typography.paragraph.lg.fontSize}px`,
    "--mw-typography-paragraph-lg-line-height": `${typography.paragraph.lg.lineHeight}`,
  }
}
