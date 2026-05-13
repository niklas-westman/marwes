import type { ButtonOptions } from "@marwes-ui/core"
import { createButtonRecipe } from "@marwes-ui/core"
import { useMemo, useState } from "react"
import {
  Pressable,
  type StyleProp,
  Text,
  type TextProps,
  type TextStyle,
  type ViewStyle,
} from "react-native"
import { useMarwesTheme } from "../../provider/marwes-native-context"
import { resolveButtonNativeTokens } from "../../styles/native-tokens/generated/first-edition.native-tokens"

export type NativeButtonProps = Omit<
  ButtonOptions,
  | "as"
  | "href"
  | "ariaExpanded"
  | "ariaControls"
  | "toggle"
  | "pressed"
  | "confirmation"
  | "tooltip"
  | "iconLeft"
  | "iconRight"
  | "iconOnly"
  | "hasVisibleText"
  | "action"
> & {
  children?: TextProps["children"]
  onPress?: () => void
  style?: StyleProp<ViewStyle>
  labelStyle?: StyleProp<TextStyle>
  testID?: string
}

export function Button({
  children,
  onPress,
  style: userStyle,
  labelStyle: userLabelStyle,
  testID,
  ...options
}: NativeButtonProps) {
  const { theme, mode } = useMarwesTheme()
  const kit = createButtonRecipe(options)

  const resolvedVariant = options.variant ?? "primary"
  const resolvedSize = options.size ?? "md"
  const isDisabled = kit.a11y.disabled ?? false

  const [pressed, setPressed] = useState(false)

  const tokens = useMemo(() => resolveButtonNativeTokens(theme), [theme])
  const base = tokens.base
  const size = tokens.sizes[resolvedSize]
  const variant = tokens.variants[resolvedVariant]
  const isText = resolvedVariant === "text"
  const isDanger = options.error === true
  const surface = isDanger
    ? resolvedVariant === "primary"
      ? theme.color.danger.base
      : variant.surface
    : pressed && variant.pressedSurface
      ? variant.pressedSurface
      : variant.surface
  const label = isDanger
    ? resolvedVariant === "primary"
      ? theme.color.danger.label
      : theme.color.danger.base
    : variant.label
  const border = isDanger ? theme.color.danger.base : variant.border
  const opacity = isDisabled
    ? mode === "dark"
      ? base.disabledOpacityDark
      : base.disabledOpacityLight
    : pressed && variant.pressedOpacity
      ? variant.pressedOpacity
      : 1

  const rootStyle: ViewStyle = {
    minHeight: isText ? undefined : size.height,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: base.gap,
    paddingHorizontal: size.paddingX,
    paddingVertical: isText ? Math.max(4, size.paddingY) : size.paddingY,
    borderRadius: base.radius,
    borderWidth: isText ? 0 : 1,
    borderColor: border,
    backgroundColor: surface,
    opacity,
  }

  const textStyle: TextStyle = {
    color: label,
    fontFamily: base.fontFamily,
    fontSize: size.fontSize,
    fontWeight: base.fontWeight as TextStyle["fontWeight"],
    lineHeight: isText ? Math.round(size.fontSize * 1.2) : size.fontSize,
    letterSpacing: 0,
  }

  return (
    <Pressable
      onPress={isDisabled ? undefined : onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={kit.a11y.ariaLabel}
      accessibilityState={{
        disabled: isDisabled,
        busy: kit.a11y.ariaBusy,
      }}
      testID={testID}
      style={[rootStyle, userStyle]}
    >
      <Text style={[textStyle, userLabelStyle]}>
        {kit.loading.isLoading ? (kit.loading.loadingLabel ?? children) : children}
      </Text>
    </Pressable>
  )
}
