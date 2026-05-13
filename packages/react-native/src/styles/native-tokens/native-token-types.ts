import type {
  AvatarOptions,
  BadgeVariant,
  ButtonOptions,
  CheckboxProps,
  DividerSize,
  IconOptions,
  SkeletonOptions,
} from "@marwes-ui/core"

export type NativeTokenValue = string | number

export type NativeTokenRef =
  | { kind: "theme"; path: string; fallback?: NativeTokenValue }
  | { kind: "static"; value: NativeTokenValue }

export type BadgeNativeToneTokens = {
  surface: NativeTokenRef
  border: NativeTokenRef
  label: NativeTokenRef
}

export type AvatarNativeSize = NonNullable<AvatarOptions["size"]>
export type AvatarNativeType = NonNullable<AvatarOptions["type"]>

export type AvatarNativeTokens = {
  base: {
    fontFamily: NativeTokenRef
    fontWeight: NativeTokenRef
    radius: NativeTokenRef
  }
  sizes: Record<
    AvatarNativeSize,
    {
      size: NativeTokenRef
      fontSize: NativeTokenRef
      lineHeight: NativeTokenRef
      letterSpacing: NativeTokenRef
      iconSize: NativeTokenRef
    }
  >
  types: Record<
    AvatarNativeType,
    {
      surface: NativeTokenRef
      borderWidth: NativeTokenRef
      borderColor: NativeTokenRef
      label: NativeTokenRef
    }
  >
}

export type BadgeNativeTokens = {
  base: {
    radius: NativeTokenRef
    paddingX: NativeTokenRef
    paddingY: NativeTokenRef
    gap: NativeTokenRef
    fontFamily: NativeTokenRef
    fontSize: NativeTokenRef
    fontWeight: NativeTokenRef
    lineHeight: NativeTokenRef
  }
  tones: Record<BadgeVariant, BadgeNativeToneTokens>
}

export type ButtonNativeSize = NonNullable<ButtonOptions["size"]>
export type ButtonNativeVariant = NonNullable<ButtonOptions["variant"]>

export type ButtonNativeVariantTokens = {
  surface: NativeTokenRef
  label: NativeTokenRef
  border: NativeTokenRef
  pressedSurface?: NativeTokenRef
  pressedOpacity?: NativeTokenRef
}

export type ButtonNativeTokens = {
  base: {
    gap: NativeTokenRef
    radius: NativeTokenRef
    fontFamily: NativeTokenRef
    fontWeight: NativeTokenRef
    disabledOpacityLight: NativeTokenRef
    disabledOpacityDark: NativeTokenRef
  }
  sizes: Record<
    ButtonNativeSize,
    {
      height: NativeTokenRef
      paddingX: NativeTokenRef
      paddingY: NativeTokenRef
      fontSize: NativeTokenRef
    }
  >
  variants: Record<ButtonNativeVariant, ButtonNativeVariantTokens>
}

export type CheckboxNativeSize = NonNullable<CheckboxProps["size"]>

export type CheckboxNativeTokens = {
  sizes: Record<CheckboxNativeSize, { size: NativeTokenRef }>
  box: {
    radius: NativeTokenRef
    radiusMultiplier: NativeTokenRef
    border: NativeTokenRef
    background: NativeTokenRef
    checkedBackground: NativeTokenRef
    check: NativeTokenRef
    disabledOpacity: NativeTokenRef
    invalidBorder: NativeTokenRef
  }
}

export type DividerNativeTokens = {
  base: {
    color: NativeTokenRef
    lineThickness: NativeTokenRef
  }
  sizes: Record<DividerSize, { spacing: NativeTokenRef }>
}

export type SkeletonNativeVariant = NonNullable<SkeletonOptions["variant"]>

export type SkeletonNativeTokens = {
  base: {
    baseColor: NativeTokenRef
    highlightColor: NativeTokenRef
    radius: NativeTokenRef
    circularRadius: NativeTokenRef
    pulseDurationMs: NativeTokenRef
    waveDurationMs: NativeTokenRef
    pulseMinOpacity: NativeTokenRef
  }
  variants: Record<
    SkeletonNativeVariant,
    {
      width: NativeTokenRef
      height: NativeTokenRef
    }
  >
}

export type IconNativeSize = NonNullable<IconOptions["size"]>
export type IconNativeColor = NonNullable<IconOptions["color"]>

export type IconNativeTokens = {
  base: {
    strokeWidth: NativeTokenRef
  }
  sizes: Record<IconNativeSize, { size: NativeTokenRef }>
  colors: Record<IconNativeColor, { color: NativeTokenRef }>
}

export type SpinnerNativeTokens = {
  base: {
    size: NativeTokenRef
  }
  colors: {
    track: NativeTokenRef
    indicator: NativeTokenRef
  }
  motion: {
    rotationDurationMs: NativeTokenRef
  }
}

export type ResolvedAvatarNativeTokens = {
  base: {
    fontFamily: string
    fontWeight: string
    radius: number
  }
  sizes: Record<
    AvatarNativeSize,
    {
      size: number
      fontSize: number
      lineHeight: number
      letterSpacing: number
      iconSize: number
    }
  >
  types: Record<
    AvatarNativeType,
    {
      surface: string
      borderWidth: number
      borderColor: string
      label: string
    }
  >
}

export type ResolvedBadgeNativeTokens = {
  base: {
    radius: number
    paddingX: number
    paddingY: number
    gap: number
    fontFamily: string
    fontSize: number
    fontWeight: string
    lineHeight: number
  }
  tones: Record<
    BadgeVariant,
    {
      surface: string
      border: string
      label: string
    }
  >
}

export type ResolvedButtonNativeTokens = {
  base: {
    gap: number
    radius: number
    fontFamily: string
    fontWeight: string
    disabledOpacityLight: number
    disabledOpacityDark: number
  }
  sizes: Record<
    ButtonNativeSize,
    {
      height: number
      paddingX: number
      paddingY: number
      fontSize: number
    }
  >
  variants: Record<
    ButtonNativeVariant,
    {
      surface: string
      label: string
      border: string
      pressedSurface?: string
      pressedOpacity?: number
    }
  >
}

export type ResolvedCheckboxNativeTokens = {
  sizes: Record<CheckboxNativeSize, { size: number }>
  box: {
    radius: number
    radiusMultiplier: number
    border: string
    background: string
    checkedBackground: string
    check: string
    disabledOpacity: number
    invalidBorder: string
  }
}

export type ResolvedDividerNativeTokens = {
  base: {
    color: string
    lineThickness: number
  }
  sizes: Record<DividerSize, { spacing: number }>
}

export type ResolvedSkeletonNativeTokens = {
  base: {
    baseColor: string
    highlightColor: string
    radius: number
    circularRadius: number
    pulseDurationMs: number
    waveDurationMs: number
    pulseMinOpacity: number
  }
  variants: Record<
    SkeletonNativeVariant,
    {
      width: number
      height: number
    }
  >
}

export type ResolvedIconNativeTokens = {
  base: {
    strokeWidth: number
  }
  sizes: Record<IconNativeSize, { size: number }>
  colors: Record<IconNativeColor, { color: string }>
}

export type ResolvedSpinnerNativeTokens = {
  base: {
    size: number
  }
  colors: {
    track: string
    indicator: string
  }
  motion: {
    rotationDurationMs: number
  }
}
