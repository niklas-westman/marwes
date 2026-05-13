import { type AvatarOptions, createAvatarRecipe } from "@marwes-ui/core"
import { useMemo } from "react"
import {
  Image,
  type ImageStyle,
  type StyleProp,
  Text,
  type TextStyle,
  View,
  type ViewProps,
  type ViewStyle,
} from "react-native"
import { useMarwesTheme } from "../../provider/marwes-native-context"
import { resolveAvatarNativeTokens } from "../../styles/native-tokens/generated/first-edition.native-tokens"

export type NativeAvatarProps = AvatarOptions & {
  style?: StyleProp<ViewStyle>
  labelStyle?: StyleProp<TextStyle>
  testID?: string
}

function AvatarIcon({ color, size }: { color: string; size: number }) {
  const headSize = size * 0.36
  const bodyWidth = size * 0.72
  const stroke = Math.max(1, Math.round(size * 0.08))

  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <View
        style={{
          width: headSize,
          height: headSize,
          borderRadius: headSize / 2,
          borderWidth: stroke,
          borderColor: color,
          marginBottom: size * 0.08,
        }}
      />
      <View
        style={{
          width: bodyWidth,
          height: size * 0.32,
          borderTopLeftRadius: bodyWidth / 2,
          borderTopRightRadius: bodyWidth / 2,
          borderWidth: stroke,
          borderBottomWidth: 0,
          borderColor: color,
        }}
      />
    </View>
  )
}

export function Avatar({
  style: userStyle,
  labelStyle: userLabelStyle,
  testID,
  ...options
}: NativeAvatarProps) {
  const { theme } = useMarwesTheme()
  const kit = createAvatarRecipe(options)
  const tokens = useMemo(() => resolveAvatarNativeTokens(theme), [theme])
  const size = tokens.sizes[kit.dataAttributes["data-size"]]
  const type = tokens.types[kit.content.type]

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
    width: size.size,
    height: size.size,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: tokens.base.radius,
    borderWidth: type.borderWidth,
    borderColor: type.borderColor,
    backgroundColor: type.surface,
  }

  const textStyle: TextStyle = {
    color: type.label,
    fontFamily: tokens.base.fontFamily,
    fontSize: size.fontSize,
    fontWeight: tokens.base.fontWeight as TextStyle["fontWeight"],
    lineHeight: size.lineHeight,
    letterSpacing: size.letterSpacing,
    textTransform: "uppercase",
  }

  const imageStyle: ImageStyle = {
    width: "100%",
    height: "100%",
  }

  return (
    <View {...accessibilityProps} testID={testID} style={[rootStyle, userStyle]}>
      {kit.content.type === "image" && kit.content.src ? (
        <Image
          source={{ uri: kit.content.src }}
          accessibilityLabel={kit.content.alt}
          style={imageStyle}
        />
      ) : null}
      {kit.content.type === "initials" ? (
        <Text style={[textStyle, userLabelStyle]}>{kit.content.initials}</Text>
      ) : null}
      {kit.content.type === "icon" ? <AvatarIcon color={type.label} size={size.iconSize} /> : null}
    </View>
  )
}
