import type { DividerOptions } from "@marwes-ui/core"
import { useMemo } from "react"
import { type StyleProp, View, type ViewStyle } from "react-native"
import { useMarwesTheme } from "../../provider/marwes-native-context"
import { resolveDividerStyles } from "../../styles/generated/first-edition"

const LINE_THICKNESS = 1

const SPACING_BY_SIZE: Record<string, number> = {
  xxs: 1,
  xs: 8,
  sm: 16,
  md: 32,
  lg: 48,
  xl: 64,
  xxl: 80,
}

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
  const { theme, mode } = useMarwesTheme()

  const baseStyles = useMemo(
    () =>
      resolveDividerStyles(
        {
          variant: orientation,
          mode,
        },
        theme,
      ),
    [orientation, mode, theme],
  )

  const spacing = SPACING_BY_SIZE[size] ?? 32
  const marginAmount = (spacing - LINE_THICKNESS) / 2

  // Extract backgroundColor from generated styles for the line
  const lineColor = (baseStyles.root as ViewStyle)?.backgroundColor ?? theme.color.border

  const isVertical = orientation === "vertical"

  const wrapperStyle: ViewStyle = isVertical
    ? {
        width: LINE_THICKNESS,
        alignSelf: "stretch",
        marginHorizontal: marginAmount,
      }
    : {
        height: LINE_THICKNESS,
        width: "100%",
        marginVertical: marginAmount,
      }

  return (
    <View
      accessibilityRole="none"
      testID={testID}
      style={[wrapperStyle, { backgroundColor: lineColor as string }, userStyle]}
    />
  )
}
