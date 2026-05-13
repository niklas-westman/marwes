import { type IconOptions, createIconRecipe } from "@marwes-ui/core"
import { useMemo } from "react"
import {
  type StyleProp,
  Text,
  type TextStyle,
  View,
  type ViewProps,
  type ViewStyle,
} from "react-native"
import { useMarwesTheme } from "../../provider/marwes-native-context"
import { resolveIconNativeTokens } from "../../styles/native-tokens/generated/first-edition.native-tokens"

export type NativeIconProps = IconOptions & {
  style?: StyleProp<ViewStyle>
  testID?: string
}

function BasicMark({
  color,
  name,
  size,
  strokeWidth,
}: {
  color: string
  name: string
  size: number
  strokeWidth: number
}) {
  const lineBase: ViewStyle = {
    position: "absolute",
    backgroundColor: color,
    borderRadius: strokeWidth,
  }

  if (name.toLowerCase().includes("check")) {
    return (
      <View style={{ width: size, height: size }}>
        <View
          style={[
            lineBase,
            {
              width: size * 0.32,
              height: strokeWidth,
              left: size * 0.22,
              top: size * 0.56,
              transform: [{ rotate: "45deg" }],
            },
          ]}
        />
        <View
          style={[
            lineBase,
            {
              width: size * 0.58,
              height: strokeWidth,
              left: size * 0.38,
              top: size * 0.48,
              transform: [{ rotate: "-45deg" }],
            },
          ]}
        />
      </View>
    )
  }

  if (name.toLowerCase().includes("x")) {
    return (
      <View style={{ width: size, height: size }}>
        <View
          style={[
            lineBase,
            {
              width: size * 0.72,
              height: strokeWidth,
              left: size * 0.14,
              top: size * 0.49,
              transform: [{ rotate: "45deg" }],
            },
          ]}
        />
        <View
          style={[
            lineBase,
            {
              width: size * 0.72,
              height: strokeWidth,
              left: size * 0.14,
              top: size * 0.49,
              transform: [{ rotate: "-45deg" }],
            },
          ]}
        />
      </View>
    )
  }

  if (name.toLowerCase().includes("plus")) {
    return (
      <View style={{ width: size, height: size }}>
        <View
          style={[
            lineBase,
            { width: size * 0.7, height: strokeWidth, left: size * 0.15, top: size * 0.5 },
          ]}
        />
        <View
          style={[
            lineBase,
            { width: strokeWidth, height: size * 0.7, left: size * 0.5, top: size * 0.15 },
          ]}
        />
      </View>
    )
  }

  const textStyle: TextStyle = {
    color,
    fontSize: Math.max(10, size * 0.42),
    fontWeight: "600",
    lineHeight: size,
    textAlign: "center",
  }

  return <Text style={textStyle}>{name.slice(0, 2).toUpperCase()}</Text>
}

export function Icon({ style: userStyle, testID, ...options }: NativeIconProps) {
  const { theme } = useMarwesTheme()
  const kit = createIconRecipe(options)
  const tokens = useMemo(() => resolveIconNativeTokens(theme), [theme])
  const sizeKey = options.size ?? "sm"
  const colorKey = options.color ?? "currentColor"
  const size = tokens.sizes[sizeKey].size
  const color = colorKey === "currentColor" ? theme.color.text : tokens.colors[colorKey].color
  const strokeWidth = tokens.base.strokeWidth

  const hidden = kit.a11y.ariaHidden === true
  const accessibilityProps: ViewProps = hidden
    ? {
        accessible: false,
        accessibilityElementsHidden: true,
        importantForAccessibility: "no-hide-descendants",
      }
    : {
        accessible: true,
        accessibilityRole: "image",
        accessibilityLabel: kit.a11y.ariaLabel,
      }

  const rootStyle: ViewStyle = {
    width: size,
    height: size,
    alignItems: "center",
    justifyContent: "center",
  }

  return (
    <View {...accessibilityProps} testID={testID} style={[rootStyle, userStyle]}>
      <BasicMark color={color} name={options.name} size={size} strokeWidth={strokeWidth} />
    </View>
  )
}
