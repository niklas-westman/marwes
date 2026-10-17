import {
  type ColorInput,
  normalizeColorInput,
  resolveInfoRole,
  resolveSecondaryRole,
} from "./color-resolve"
import type { ResolvedTheme } from "./theme-css"
import { darkThemeDefaults, lightThemeDefaults } from "./theme-defaults"
import { type ThemeInput, ThemeMode, defaultThemeBreakpoints } from "./theme-types"
import { resolveTone } from "./tone"

const lightDefaultColorRoles = {
  primary: {
    base: "#2F31FC",
    hover: "#2527CA",
    pressed: "#1B1D97",
    disabled: "rgba(129,130,252,0.3)",
    label: "#FFFFFF",
    labelDisabled: "rgba(255,255,255,0.6)",
  },
  secondary: {
    hover: "#EEEEFF",
    pressed: "#D4D5FE",
    label: "#2F31FC",
    labelDisabled: "rgba(47,49,252,0.3)",
    border: "#2F31FC",
    borderDisabled: "rgba(47,49,252,0.3)",
  },
  danger: {
    base: "#D90429",
    hover: "#A8031F",
    pressed: "#780215",
    disabled: "rgba(217,4,41,0.3)",
    label: "#FFFFFF",
    labelDisabled: "rgba(255,255,255,0.3)",
  },
  success: {
    base: "#00875A",
    disabled: "rgba(0,135,90,0.3)",
    label: "#FFFFFF",
    labelDisabled: "rgba(255,255,255,0.3)",
  },
  warning: {
    base: "#B45309",
  },
  info: {
    base: "#2F31FC",
  },
} satisfies Record<"primary" | "danger" | "success" | "warning" | "info", ColorInput> & {
  secondary: Partial<ReturnType<typeof resolveSecondaryRole>>
}

const darkDefaultColorRoles = {
  primary: {
    base: "#2F31FC",
    hover: "#5859FC",
    pressed: "#8182FC",
    disabled: "rgba(129,130,252,0.3)",
    label: "#FFFFFF",
    labelDisabled: "rgba(255,255,255,0.3)",
  },
  secondary: {
    hover: "#090A32",
    pressed: "#121365",
    label: "#F9FAFB",
    labelDisabled: "rgba(255,255,255,0.3)",
    border: "#F9FAFB",
    borderDisabled: "rgba(255,255,255,0.3)",
  },
  danger: {
    base: "#D90429",
    hover: "#FF2847",
    pressed: "#FF5566",
    disabled: "rgba(217,4,41,0.3)",
    label: "#FFFFFF",
    labelDisabled: "rgba(255,255,255,0.3)",
  },
  success: {
    base: "#00875A",
    disabled: "rgba(0,135,90,0.3)",
    label: "#FFFFFF",
    labelDisabled: "rgba(255,255,255,0.3)",
  },
  warning: {
    base: "#FCC94A",
  },
  info: {
    base: "#8182FC",
  },
} satisfies Record<"primary" | "danger" | "success" | "warning" | "info", ColorInput> & {
  secondary: Partial<ReturnType<typeof resolveSecondaryRole>>
}

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
  const mode = input.mode ?? ThemeMode.light
  const personality = input.personality ?? "flat"
  const colorBase = mode === ThemeMode.dark ? darkThemeDefaults.color : lightThemeDefaults.color
  const defaultColorRoles = mode === ThemeMode.dark ? darkDefaultColorRoles : lightDefaultColorRoles
  const base = lightThemeDefaults

  const tone = resolveTone(input.tone ?? "default")

  const primary = normalizeColorInput(input.color?.primary ?? defaultColorRoles.primary)
  const secondary =
    input.color?.primary === undefined
      ? resolveSecondaryRole(primary, defaultColorRoles.secondary)
      : resolveSecondaryRole(primary)
  const danger = normalizeColorInput(input.color?.danger ?? defaultColorRoles.danger)
  const success = normalizeColorInput(input.color?.success ?? defaultColorRoles.success)
  const warning = normalizeColorInput(input.color?.warning ?? defaultColorRoles.warning)
  const info =
    input.color?.primary === undefined
      ? normalizeColorInput(defaultColorRoles.info)
      : resolveInfoRole(primary)

  return {
    mode,
    personality,
    color: {
      primary,
      secondary,
      danger,
      success,
      warning,
      info,
      background: input.color?.background ?? colorBase.background,
      surface: input.color?.surface ?? colorBase.surface,
      surfacePrimary: input.color?.surfacePrimary ?? colorBase.surfacePrimary,
      surfaceSubtle: input.color?.surfaceSubtle ?? colorBase.surfaceSubtle,
      surfaceBrand: input.color?.surfaceBrand ?? colorBase.surfaceBrand,
      surfaceElevated: input.color?.surfaceElevated ?? colorBase.surfaceElevated,
      surfaceDisabled: input.color?.surfaceDisabled ?? colorBase.surfaceDisabled,
      surfaceInverted: input.color?.surfaceInverted ?? colorBase.surfaceInverted,
      text: input.color?.text ?? colorBase.text,
      textMuted: input.color?.textMuted ?? colorBase.textMuted,
      textSubtle: input.color?.textSubtle ?? colorBase.textSubtle,
      textDisabled: input.color?.textDisabled ?? colorBase.textDisabled,
      textInverted: input.color?.textInverted ?? colorBase.textInverted,
      textBrand: colorBase.textBrand,
      textLink: input.color?.textLink ?? colorBase.textLink,
      iconMuted: input.color?.iconMuted ?? colorBase.iconMuted,
      borderLow: input.color?.borderLow ?? colorBase.borderLow,
      borderMedium:
        input.color?.borderMedium ??
        colorBase.borderMedium ??
        (mode === ThemeMode.dark ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.2)"),
      border: input.color?.border ?? colorBase.border,
      borderSubtle: input.color?.borderSubtle ?? colorBase.borderSubtle,
      borderStrong: input.color?.borderStrong ?? colorBase.borderStrong,
      borderDisabled: input.color?.borderDisabled ?? colorBase.borderDisabled,
      borderBrand: colorBase.borderBrand,
      borderFull: input.color?.borderFull ?? colorBase.borderFull,
      focus: input.color?.focus ?? colorBase.focus,
      status: colorBase.status,
    },
    font: { ...base.font, ...tone.font, ...input.font },
    ui: { ...base.ui, ...tone.ui, ...input.ui },
    breakpoint: { ...defaultThemeBreakpoints, ...input.breakpoint },
    typography: {
      display: {
        ...base.typography.display,
        ...tone.typography?.display,
        ...input.typography?.display,
      },
      h1: { ...base.typography.h1, ...tone.typography?.h1, ...input.typography?.h1 },
      h2: { ...base.typography.h2, ...tone.typography?.h2, ...input.typography?.h2 },
      h3: { ...base.typography.h3, ...tone.typography?.h3, ...input.typography?.h3 },
      text: {
        display: {
          ...base.typography.text.display,
          ...tone.typography?.text?.display,
          ...input.typography?.text?.display,
        },
        label: {
          ...base.typography.text.label,
          ...tone.typography?.text?.label,
          ...input.typography?.text?.label,
        },
        "label-small": {
          ...base.typography.text["label-small"],
          ...tone.typography?.text?.["label-small"],
          ...input.typography?.text?.["label-small"],
        },
        caption: {
          ...base.typography.text.caption,
          ...tone.typography?.text?.caption,
          ...input.typography?.text?.caption,
        },
        overline: {
          ...base.typography.text.overline,
          ...tone.typography?.text?.overline,
          ...input.typography?.text?.overline,
        },
        micro: {
          ...base.typography.text.micro,
          ...tone.typography?.text?.micro,
          ...input.typography?.text?.micro,
        },
      },
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
