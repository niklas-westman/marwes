import type { BadgeVariant, DividerSize, ResolvedTheme } from "@marwes-ui/core"
import type {
  AvatarNativeSize,
  AvatarNativeType,
  ButtonNativeSize,
  ButtonNativeVariant,
  CheckboxNativeSize,
  IconNativeColor,
  IconNativeSize,
  ResolvedAvatarNativeTokens,
  ResolvedBadgeNativeTokens,
  ResolvedButtonNativeTokens,
  ResolvedCheckboxNativeTokens,
  ResolvedDividerNativeTokens,
  ResolvedIconNativeTokens,
  ResolvedSkeletonNativeTokens,
  ResolvedSpinnerNativeTokens,
  SkeletonNativeVariant,
} from "../native-token-types"
import { resolveNativeNumber, resolveNativeString } from "../resolve-native-token"
import {
  firstEditionAvatarNativeTokens,
  firstEditionBadgeNativeTokens,
  firstEditionButtonNativeTokens,
  firstEditionCheckboxNativeTokens,
  firstEditionDividerNativeTokens,
  firstEditionIconNativeTokens,
  firstEditionSkeletonNativeTokens,
  firstEditionSpinnerNativeTokens,
} from "./first-edition.native-token-data"

function resolveAvatarSize(
  size: AvatarNativeSize,
  theme: ResolvedTheme,
): ResolvedAvatarNativeTokens["sizes"][AvatarNativeSize] {
  const token = firstEditionAvatarNativeTokens.sizes[size]

  return {
    size: resolveNativeNumber(token.size, theme),
    fontSize: resolveNativeNumber(token.fontSize, theme),
    lineHeight: resolveNativeNumber(token.lineHeight, theme),
    letterSpacing: resolveNativeNumber(token.letterSpacing, theme),
    iconSize: resolveNativeNumber(token.iconSize, theme),
  }
}

function resolveAvatarType(
  type: AvatarNativeType,
  theme: ResolvedTheme,
): ResolvedAvatarNativeTokens["types"][AvatarNativeType] {
  const token = firstEditionAvatarNativeTokens.types[type]

  return {
    surface: resolveNativeString(token.surface, theme),
    borderWidth: resolveNativeNumber(token.borderWidth, theme),
    borderColor: resolveNativeString(token.borderColor, theme),
    label: resolveNativeString(token.label, theme),
  }
}

export function resolveAvatarNativeTokens(theme: ResolvedTheme): ResolvedAvatarNativeTokens {
  const { base } = firstEditionAvatarNativeTokens

  return {
    base: {
      fontFamily: resolveNativeString(base.fontFamily, theme),
      fontWeight: resolveNativeString(base.fontWeight, theme),
      radius: resolveNativeNumber(base.radius, theme),
    },
    sizes: {
      small: resolveAvatarSize("small", theme),
      medium: resolveAvatarSize("medium", theme),
      large: resolveAvatarSize("large", theme),
    },
    types: {
      initials: resolveAvatarType("initials", theme),
      icon: resolveAvatarType("icon", theme),
      image: resolveAvatarType("image", theme),
    },
  }
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

function resolveButtonSize(
  size: ButtonNativeSize,
  theme: ResolvedTheme,
): ResolvedButtonNativeTokens["sizes"][ButtonNativeSize] {
  const token = firstEditionButtonNativeTokens.sizes[size]

  return {
    height: resolveNativeNumber(token.height, theme),
    paddingX: resolveNativeNumber(token.paddingX, theme),
    paddingY: resolveNativeNumber(token.paddingY, theme),
    fontSize: resolveNativeNumber(token.fontSize, theme),
  }
}

function resolveButtonVariant(
  variant: ButtonNativeVariant,
  theme: ResolvedTheme,
): ResolvedButtonNativeTokens["variants"][ButtonNativeVariant] {
  const token = firstEditionButtonNativeTokens.variants[variant]

  return {
    surface: resolveNativeString(token.surface, theme),
    label: resolveNativeString(token.label, theme),
    border: resolveNativeString(token.border, theme),
    ...(token.pressedSurface
      ? { pressedSurface: resolveNativeString(token.pressedSurface, theme) }
      : {}),
    ...(token.pressedOpacity
      ? { pressedOpacity: resolveNativeNumber(token.pressedOpacity, theme) }
      : {}),
  }
}

export function resolveButtonNativeTokens(theme: ResolvedTheme): ResolvedButtonNativeTokens {
  const { base } = firstEditionButtonNativeTokens

  return {
    base: {
      gap: resolveNativeNumber(base.gap, theme),
      radius: resolveNativeNumber(base.radius, theme),
      fontFamily: resolveNativeString(base.fontFamily, theme),
      fontWeight: resolveNativeString(base.fontWeight, theme),
      disabledOpacityLight: resolveNativeNumber(base.disabledOpacityLight, theme),
      disabledOpacityDark: resolveNativeNumber(base.disabledOpacityDark, theme),
    },
    sizes: {
      xs: resolveButtonSize("xs", theme),
      sm: resolveButtonSize("sm", theme),
      md: resolveButtonSize("md", theme),
      lg: resolveButtonSize("lg", theme),
    },
    variants: {
      primary: resolveButtonVariant("primary", theme),
      secondary: resolveButtonVariant("secondary", theme),
      neutral: resolveButtonVariant("neutral", theme),
      text: resolveButtonVariant("text", theme),
      success: resolveButtonVariant("success", theme),
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

function resolveDividerSize(
  size: DividerSize,
  theme: ResolvedTheme,
): ResolvedDividerNativeTokens["sizes"][DividerSize] {
  const token = firstEditionDividerNativeTokens.sizes[size]

  return {
    spacing: resolveNativeNumber(token.spacing, theme),
  }
}

export function resolveDividerNativeTokens(theme: ResolvedTheme): ResolvedDividerNativeTokens {
  const { base } = firstEditionDividerNativeTokens

  return {
    base: {
      color: resolveNativeString(base.color, theme),
      lineThickness: resolveNativeNumber(base.lineThickness, theme),
    },
    sizes: {
      xxs: resolveDividerSize("xxs", theme),
      xs: resolveDividerSize("xs", theme),
      sm: resolveDividerSize("sm", theme),
      md: resolveDividerSize("md", theme),
      lg: resolveDividerSize("lg", theme),
      xl: resolveDividerSize("xl", theme),
      xxl: resolveDividerSize("xxl", theme),
    },
  }
}

function resolveIconSize(
  size: IconNativeSize,
  theme: ResolvedTheme,
): ResolvedIconNativeTokens["sizes"][IconNativeSize] {
  const token = firstEditionIconNativeTokens.sizes[size]

  return {
    size: resolveNativeNumber(token.size, theme),
  }
}

function resolveIconColor(
  color: IconNativeColor,
  theme: ResolvedTheme,
): ResolvedIconNativeTokens["colors"][IconNativeColor] {
  const token = firstEditionIconNativeTokens.colors[color]

  return {
    color: resolveNativeString(token.color, theme),
  }
}

export function resolveIconNativeTokens(theme: ResolvedTheme): ResolvedIconNativeTokens {
  const { base } = firstEditionIconNativeTokens

  return {
    base: {
      strokeWidth: resolveNativeNumber(base.strokeWidth, theme),
    },
    sizes: {
      xs: resolveIconSize("xs", theme),
      sm: resolveIconSize("sm", theme),
      md: resolveIconSize("md", theme),
      lg: resolveIconSize("lg", theme),
    },
    colors: {
      currentColor: resolveIconColor("currentColor", theme),
      primary: resolveIconColor("primary", theme),
      secondary: resolveIconColor("secondary", theme),
      muted: resolveIconColor("muted", theme),
    },
  }
}

function resolveSkeletonVariant(
  variant: SkeletonNativeVariant,
  theme: ResolvedTheme,
): ResolvedSkeletonNativeTokens["variants"][SkeletonNativeVariant] {
  const token = firstEditionSkeletonNativeTokens.variants[variant]

  return {
    width: resolveNativeNumber(token.width, theme),
    height: resolveNativeNumber(token.height, theme),
  }
}

export function resolveSkeletonNativeTokens(theme: ResolvedTheme): ResolvedSkeletonNativeTokens {
  const { base } = firstEditionSkeletonNativeTokens

  return {
    base: {
      baseColor: resolveNativeString(base.baseColor, theme),
      highlightColor: resolveNativeString(base.highlightColor, theme),
      radius: resolveNativeNumber(base.radius, theme),
      circularRadius: resolveNativeNumber(base.circularRadius, theme),
      pulseDurationMs: resolveNativeNumber(base.pulseDurationMs, theme),
      waveDurationMs: resolveNativeNumber(base.waveDurationMs, theme),
      pulseMinOpacity: resolveNativeNumber(base.pulseMinOpacity, theme),
    },
    variants: {
      text: resolveSkeletonVariant("text", theme),
      circular: resolveSkeletonVariant("circular", theme),
      rectangular: resolveSkeletonVariant("rectangular", theme),
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
