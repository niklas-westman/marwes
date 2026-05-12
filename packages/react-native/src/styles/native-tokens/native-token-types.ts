import type { BadgeVariant } from "@marwes-ui/core"

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
