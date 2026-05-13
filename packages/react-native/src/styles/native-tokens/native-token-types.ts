import type { BadgeVariant, CheckboxProps } from "@marwes-ui/core"

export type NativeTokenValue = string | number

export type NativeTokenRef =
  | { kind: "theme"; path: string; fallback?: NativeTokenValue }
  | { kind: "static"; value: NativeTokenValue }

export type BadgeNativeToneTokens = {
  surface: NativeTokenRef
  border: NativeTokenRef
  label: NativeTokenRef
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
