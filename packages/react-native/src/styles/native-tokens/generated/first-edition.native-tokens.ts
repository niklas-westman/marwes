import type { BadgeVariant, ResolvedTheme } from "@marwes-ui/core"
import type {
  BadgeNativeTokens,
  CheckboxNativeSize,
  CheckboxNativeTokens,
  ResolvedBadgeNativeTokens,
  ResolvedCheckboxNativeTokens,
} from "../native-token-types"
import { resolveNativeNumber, resolveNativeString } from "../resolve-native-token"

export const firstEditionBadgeNativeTokens: BadgeNativeTokens = {
  base: {
    radius: { kind: "theme", path: "ui.radius", fallback: 4 },
    paddingX: { kind: "static", value: 8 },
    paddingY: { kind: "static", value: 2 },
    gap: { kind: "static", value: 4 },
    fontFamily: { kind: "theme", path: "font.primary", fallback: "System" },
    fontSize: { kind: "static", value: 12 },
    fontWeight: { kind: "static", value: "500" },
    lineHeight: { kind: "static", value: 16 },
  },
  tones: {
    neutral: {
      surface: { kind: "theme", path: "color.surfaceSubtle", fallback: "#f5f5f5" },
      border: { kind: "theme", path: "color.borderSubtle", fallback: "#d8d8d8" },
      label: { kind: "theme", path: "color.textMuted", fallback: "#595959" },
    },
    info: {
      surface: { kind: "theme", path: "color.status.info.background", fallback: "#eeeeff" },
      border: { kind: "theme", path: "color.status.info.border", fallback: "#ababfd" },
      label: { kind: "theme", path: "color.status.info.text", fallback: "#1b1d97" },
    },
    success: {
      surface: { kind: "theme", path: "color.status.success.background", fallback: "#e6f4ed" },
      border: { kind: "theme", path: "color.status.success.border", fallback: "#90caad" },
      label: { kind: "theme", path: "color.status.success.text", fallback: "#006633" },
    },
    warning: {
      surface: { kind: "theme", path: "color.status.warning.background", fallback: "#fff8e6" },
      border: { kind: "theme", path: "color.status.warning.border", fallback: "#fde08a" },
      label: { kind: "theme", path: "color.status.warning.text", fallback: "#b45309" },
    },
    error: {
      surface: { kind: "theme", path: "color.status.error.background", fallback: "#ffe8eb" },
      border: { kind: "theme", path: "color.status.error.border", fallback: "#ff8a95" },
      label: { kind: "theme", path: "color.status.error.text", fallback: "#a8031f" },
    },
  },
}

export const firstEditionCheckboxNativeTokens: CheckboxNativeTokens = {
  sizes: {
    sm: { size: { kind: "static", value: 16 } },
    md: { size: { kind: "static", value: 18 } },
    lg: { size: { kind: "static", value: 22 } },
  },
  box: {
    radiusMultiplier: { kind: "static", value: 0.4 },
    border: { kind: "theme", path: "color.border", fallback: "#b8b8b8" },
    background: { kind: "theme", path: "color.surface", fallback: "#ffffff" },
    checkedBackground: { kind: "theme", path: "color.primary", fallback: "#111111" },
    check: { kind: "theme", path: "color.textInverted", fallback: "#ffffff" },
    disabledOpacity: { kind: "static", value: 0.3 },
    invalidBorder: { kind: "theme", path: "color.danger", fallback: "#b00020" },
  },
}

function resolveBadgeTone(
  variant: BadgeVariant,
  theme: ResolvedTheme,
): ResolvedBadgeNativeTokens["tones"][BadgeVariant] {
  const tone = firstEditionBadgeNativeTokens.tones[variant]

  return {
    surface: resolveNativeString(tone.surface, theme),
    border: resolveNativeString(tone.border, theme),
    label: resolveNativeString(tone.label, theme),
  }
}

export function resolveBadgeNativeTokens(theme: ResolvedTheme): ResolvedBadgeNativeTokens {
  const { base } = firstEditionBadgeNativeTokens

  return {
    base: {
      radius: resolveNativeNumber(base.radius, theme),
      paddingX: resolveNativeNumber(base.paddingX, theme),
      paddingY: resolveNativeNumber(base.paddingY, theme),
      gap: resolveNativeNumber(base.gap, theme),
      fontFamily: resolveNativeString(base.fontFamily, theme),
      fontSize: resolveNativeNumber(base.fontSize, theme),
      fontWeight: resolveNativeString(base.fontWeight, theme),
      lineHeight: resolveNativeNumber(base.lineHeight, theme),
    },
    tones: {
      neutral: resolveBadgeTone("neutral", theme),
      info: resolveBadgeTone("info", theme),
      success: resolveBadgeTone("success", theme),
      warning: resolveBadgeTone("warning", theme),
      error: resolveBadgeTone("error", theme),
    },
  }
}

function resolveCheckboxSize(
  size: CheckboxNativeSize,
  theme: ResolvedTheme,
): ResolvedCheckboxNativeTokens["sizes"][CheckboxNativeSize] {
  const token = firstEditionCheckboxNativeTokens.sizes[size]

  return {
    size: resolveNativeNumber(token.size, theme),
  }
}

export function resolveCheckboxNativeTokens(theme: ResolvedTheme): ResolvedCheckboxNativeTokens {
  const { box } = firstEditionCheckboxNativeTokens

  return {
    sizes: {
      sm: resolveCheckboxSize("sm", theme),
      md: resolveCheckboxSize("md", theme),
      lg: resolveCheckboxSize("lg", theme),
    },
    box: {
      radiusMultiplier: resolveNativeNumber(box.radiusMultiplier, theme),
      border: resolveNativeString(box.border, theme),
      background: resolveNativeString(box.background, theme),
      checkedBackground: resolveNativeString(box.checkedBackground, theme),
      check: resolveNativeString(box.check, theme),
      disabledOpacity: resolveNativeNumber(box.disabledOpacity, theme),
      invalidBorder: resolveNativeString(box.invalidBorder, theme),
    },
  }
}
