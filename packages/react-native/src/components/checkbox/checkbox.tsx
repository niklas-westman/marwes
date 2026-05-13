import { type CheckboxProps as CoreCheckboxProps, checkboxRecipe } from "@marwes-ui/core"
import { useMemo, useState } from "react"
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from "react-native"
import { useMarwesTheme } from "../../provider/marwes-native-context"
import { resolveCheckboxNativeTokens } from "../../styles/native-tokens/generated/first-edition.native-tokens"
import { CheckboxMark } from "./checkbox-mark"

export type NativeCheckboxProps = CoreCheckboxProps & {
  onCheckedChange?: (checked: boolean) => void
  onPress?: PressableProps["onPress"]
  style?: StyleProp<ViewStyle>
  testID?: string
}

export function Checkbox({
  onCheckedChange,
  onPress,
  style: userStyle,
  testID,
  ...options
}: NativeCheckboxProps) {
  const { theme } = useMarwesTheme()
  const kit = checkboxRecipe(options)
  const resolvedSize = options.size ?? "md"
  const [uncontrolledChecked, setUncontrolledChecked] = useState(kit.defaultChecked ?? false)

  const checked = kit.checked ?? uncontrolledChecked
  const mixed = kit.indeterminate
  const disabled = kit.a11y.disabled === true
  const invalid = kit.a11y.ariaInvalid === true

  const tokens = useMemo(() => resolveCheckboxNativeTokens(theme), [theme])
  const size = tokens.sizes[resolvedSize].size
  const checkedSurface = invalid ? tokens.box.invalidBorder : tokens.box.checkedBackground
  const active = checked || mixed

  const rootStyle: ViewStyle = {
    width: size,
    height: size,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: Math.max(2, tokens.box.radius * tokens.box.radiusMultiplier),
    borderColor: invalid ? tokens.box.invalidBorder : active ? checkedSurface : tokens.box.border,
    backgroundColor: active ? checkedSurface : tokens.box.background,
    opacity: disabled ? tokens.box.disabledOpacity : 1,
  }

  const handlePress: PressableProps["onPress"] = (event) => {
    if (disabled) {
      return
    }

    const nextChecked = mixed ? true : !checked
    if (kit.checked === undefined) {
      setUncontrolledChecked(nextChecked)
    }

    onPress?.(event)
    onCheckedChange?.(nextChecked)
  }

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityLabel={kit.a11y.ariaLabel}
      accessibilityLabelledBy={kit.a11y.ariaLabelledBy}
      accessibilityState={{
        checked: mixed ? "mixed" : checked,
        disabled,
      }}
      disabled={disabled}
      onPress={handlePress}
      testID={testID}
      style={[rootStyle, userStyle]}
    >
      <CheckboxMark checked={checked} mixed={mixed} color={tokens.box.check} size={size} />
    </Pressable>
  )
}
