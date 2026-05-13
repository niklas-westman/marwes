import type { BadgeVariant, ResolvedTheme } from "@marwes-ui/core"
import type {
  CheckboxNativeSize,
  ResolvedBadgeNativeTokens,
  ResolvedCheckboxNativeTokens,
  ResolvedSpinnerNativeTokens,
} from "../native-token-types"
import { resolveNativeNumber, resolveNativeString } from "../resolve-native-token"
import {
  firstEditionBadgeNativeTokens,
  firstEditionCheckboxNativeTokens,
  firstEditionSpinnerNativeTokens,
} from "./first-edition.native-token-data"

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
      radius: resolveNativeNumber(box.radius, theme),
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

export function resolveSpinnerNativeTokens(theme: ResolvedTheme): ResolvedSpinnerNativeTokens {
  const { base, colors, motion } = firstEditionSpinnerNativeTokens

  return {
    base: {
      size: resolveNativeNumber(base.size, theme),
    },
    colors: {
      track: resolveNativeString(colors.track, theme),
      indicator: resolveNativeString(colors.indicator, theme),
    },
    motion: {
      rotationDurationMs: resolveNativeNumber(motion.rotationDurationMs, theme),
    },
  }
}
