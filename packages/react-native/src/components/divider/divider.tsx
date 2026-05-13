import type { DividerOptions } from "@marwes-ui/core"
import { useMemo } from "react"
import { type StyleProp, View, type ViewStyle } from "react-native"
import { useMarwesTheme } from "../../provider/marwes-native-context"
import { resolveDividerNativeTokens } from "../../styles/native-tokens/generated/first-edition.native-tokens"

export type NativeDividerProps = DividerOptions & {
  style?: StyleProp<ViewStyle>
  testID?: string
}

/**
 * Native Divider.
 *
 * Web CSS uses background-color + background-clip:content-box + padding
 * to create spacing around a 1px line. RN has no background-clip, so
 * we render the line as a nested View with backgroundColor and use
 * margin on the outer wrapper for spacing.
 */
export function Divider({
  size = "md",
  orientation = "horizontal",
  style: userStyle,
  testID,
}: NativeDividerProps) {
  const { theme } = useMarwesTheme()
  const tokens = useMemo(() => resolveDividerNativeTokens(theme), [theme])

  const lineThickness = tokens.base.lineThickness
  const spacing = tokens.sizes[size].spacing
  const marginAmount = (spacing - lineThickness) / 2

  const isVertical = orientation === "vertical"

  const wrapperStyle: ViewStyle = isVertical
    ? {
        width: lineThickness,
        alignSelf: "stretch",
        marginHorizontal: marginAmount,
      }
    : {
        height: lineThickness,
        width: "100%",
        marginVertical: marginAmount,
      }

  return (
    <View
      accessibilityRole="none"
      testID={testID}
      style={[wrapperStyle, { backgroundColor: tokens.base.color }, userStyle]}
    />
  )
}
