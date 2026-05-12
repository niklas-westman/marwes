import type { BadgeVariant, ResolvedTheme } from "@marwes-ui/core"
import type { BadgeNativeTokens, ResolvedBadgeNativeTokens } from "../native-token-types"
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
