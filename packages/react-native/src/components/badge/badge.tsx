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
import { resolveBadgeStyles } from "../../styles/generated/first-edition"

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
  const { theme, mode } = useMarwesTheme()
  const kit = createBadgeRecipe(options)

  const resolvedVariant = options.variant ?? "neutral"

  const styles = useMemo(
    () =>
      resolveBadgeStyles(
        {
          variant: resolvedVariant,
          mode,
        },
        theme,
      ),
    [resolvedVariant, mode, theme],
  )

  return (
    <View
      accessibilityRole="text"
      accessibilityLabel={kit.a11y.ariaLabel}
      testID={testID}
      style={[styles.root, userStyle]}
    >
      <Text style={[styles.label, userLabelStyle]}>{children}</Text>
    </View>
  )
}
