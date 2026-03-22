import { normalizeColorInput, resolveInfoRole, resolveSecondaryRole } from "./color-resolve"
import type { ResolvedTheme } from "./theme-css"
import { darkThemeDefaults, lightThemeDefaults } from "./theme-defaults"
import type { ThemeInput } from "./theme-types"
import { resolveTone } from "./tone"

/**
 * Converts a consumer ThemeInput into a fully-resolved ResolvedTheme.
 * Derivable color roles (primary, danger, success, warning) are run through
 * normalizeColorInput. Secondary and info are always derived — never configured.
 * Font, ui, and typography merge against lightThemeDefaults (same for both modes).
 *
 * Merge order: defaults ← tone overrides ← explicit user overrides.
 * This ensures user-supplied values always win over tone defaults.
 */
export function resolveThemeInput(input: ThemeInput): ResolvedTheme {
  const mode = input.mode ?? "light"
  const colorBase = mode === "dark" ? darkThemeDefaults.color : lightThemeDefaults.color
  const base = lightThemeDefaults

  const tone = resolveTone(input.tone ?? "default")

  const primary = normalizeColorInput(input.color?.primary ?? colorBase.primary)
  const danger = normalizeColorInput(input.color?.danger ?? colorBase.danger)
  const success = normalizeColorInput(input.color?.success ?? colorBase.success)
  const warning = normalizeColorInput(input.color?.warning ?? colorBase.warning)

  return {
    color: {
      primary,
      secondary: resolveSecondaryRole(primary),
      danger,
      success,
      warning,
      info: resolveInfoRole(primary),
      background: input.color?.background ?? colorBase.background,
      surface: input.color?.surface ?? colorBase.surface,
      surfaceInverted: input.color?.surfaceInverted ?? colorBase.surfaceInverted,
      text: input.color?.text ?? colorBase.text,
      textMuted: input.color?.textMuted ?? colorBase.textMuted,
      textInverted: input.color?.textInverted ?? colorBase.textInverted,
      border: input.color?.border ?? colorBase.border,
      borderSubtle: input.color?.borderSubtle ?? colorBase.borderSubtle,
      focus: input.color?.focus ?? colorBase.focus,
    },
    font: { ...base.font, ...tone.font, ...input.font },
    ui: { ...base.ui, ...tone.ui, ...input.ui },
    typography: {
      h1: { ...base.typography.h1, ...tone.typography?.h1, ...input.typography?.h1 },
      h2: { ...base.typography.h2, ...tone.typography?.h2, ...input.typography?.h2 },
      h3: { ...base.typography.h3, ...tone.typography?.h3, ...input.typography?.h3 },
      paragraph: {
        sm: {
          ...base.typography.paragraph.sm,
          ...tone.typography?.paragraph?.sm,
          ...input.typography?.paragraph?.sm,
        },
        md: {
          ...base.typography.paragraph.md,
          ...tone.typography?.paragraph?.md,
          ...input.typography?.paragraph?.md,
        },
        lg: {
          ...base.typography.paragraph.lg,
          ...tone.typography?.paragraph?.lg,
          ...input.typography?.paragraph?.lg,
        },
      },
    },
  }
}
