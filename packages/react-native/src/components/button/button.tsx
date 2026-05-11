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
import { resolveButtonStyles } from "../../styles/generated/first-edition"

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

  const styles = useMemo(
    () =>
      resolveButtonStyles(
        {
          variant: resolvedVariant,
          size: resolvedSize,
          mode,
          state: {
            pressed,
            disabled: isDisabled,
            focused: false,
            hovered: false,
          },
          dataAttributes: {
            error: options.error ? "true" : undefined,
          },
        },
        theme,
      ),
    [resolvedVariant, resolvedSize, mode, pressed, isDisabled, options.error, theme],
  )

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
      style={[styles.root, userStyle]}
    >
      <Text style={[styles.label, userLabelStyle]}>{children}</Text>
    </Pressable>
  )
}
