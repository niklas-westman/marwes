import type { BadgeOptions } from "@marwes-ui/core"
import { createBadgeRecipe } from "@marwes-ui/core"
import { useMemo } from "react"
import {
  type StyleProp,
  Text,
  type TextProps,
  type TextStyle,
  View,
  type ViewStyle,
} from "react-native"
import { useMarwesTheme } from "../../provider/marwes-native-context"
import { resolveBadgeNativeTokens } from "../../styles/native-tokens/generated/first-edition.native-tokens"

export type NativeBadgeProps = BadgeOptions & {
  children?: TextProps["children"]
  style?: StyleProp<ViewStyle>
  labelStyle?: StyleProp<TextStyle>
  testID?: string
}

export function Badge({
  children,
  style: userStyle,
  labelStyle: userLabelStyle,
  testID,
  ...options
}: NativeBadgeProps) {
  const { theme } = useMarwesTheme()
  const kit = createBadgeRecipe(options)

  const resolvedVariant = options.variant ?? "neutral"

  const tokens = useMemo(() => resolveBadgeNativeTokens(theme), [theme])
  const base = tokens.base
  const tone = tokens.tones[resolvedVariant]

  const rootStyle: ViewStyle = {
    flexDirection: "row",
    alignItems: "center",
    gap: base.gap,
    paddingHorizontal: base.paddingX,
    paddingVertical: base.paddingY,
    borderWidth: 1,
    borderColor: tone.border,
    borderRadius: base.radius,
    backgroundColor: tone.surface,
  }

  const textStyle: TextStyle = {
    color: tone.label,
    fontFamily: base.fontFamily,
    fontSize: base.fontSize,
    fontWeight: base.fontWeight as TextStyle["fontWeight"],
    lineHeight: base.lineHeight,
    letterSpacing: 0,
  }

  return (
    <View
      accessibilityRole="text"
      accessibilityLabel={kit.a11y.ariaLabel}
      testID={testID}
      style={[rootStyle, userStyle]}
    >
      <Text style={[textStyle, userLabelStyle]}>{children}</Text>
    </View>
  )
}
