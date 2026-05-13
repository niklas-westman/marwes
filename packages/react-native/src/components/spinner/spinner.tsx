import {
  type SpinnerOptions,
  type SpinnerVariant,
  createSpinnerRecipe,
  resolveSpinnerSize,
} from "@marwes-ui/core"
import { useEffect, useMemo, useRef } from "react"
import {
  Animated,
  Easing,
  type StyleProp,
  View,
  type ViewProps,
  type ViewStyle,
} from "react-native"
import { useMarwesTheme } from "../../provider/marwes-native-context"
import { resolveSpinnerNativeTokens } from "../../styles/native-tokens/generated/first-edition.native-tokens"
import { SpinnerSegments } from "./spinner-segments"

export type NativeSpinnerProps = SpinnerOptions & {
  style?: StyleProp<ViewStyle>
  testID?: string
}

function isSegmentVariant(variant: SpinnerVariant): boolean {
  return (
    variant === "cross" ||
    variant === "dots-round" ||
    variant === "dots-square" ||
    variant === "lines"
  )
}

function RingSpinner({
  indicatorColor,
  rotate,
  size,
  trackColor,
  variant,
}: {
  indicatorColor: string
  rotate: Animated.AnimatedInterpolation<string>
  size: number
  trackColor: string
  variant: SpinnerVariant
}) {
  const stroke = Math.max(2, Math.round(size * 0.085))
  const circleStyle: ViewStyle = {
    position: "absolute",
    width: size,
    height: size,
    borderRadius: size / 2,
    borderWidth: stroke,
  }

  const trackStyle: ViewStyle = {
    ...circleStyle,
    borderColor: variant === "ring" ? "transparent" : trackColor,
  }

  const indicatorStyle: ViewStyle = {
    ...circleStyle,
    borderColor: "transparent",
    borderTopColor: indicatorColor,
    borderRightColor: variant === "ring" ? indicatorColor : "transparent",
  }

  const secondIndicatorStyle: ViewStyle = {
    ...circleStyle,
    borderColor: "transparent",
    borderBottomColor: indicatorColor,
    borderLeftColor: indicatorColor,
    opacity: 0.5,
  }

  return (
    <View style={{ width: size, height: size }}>
      <View style={trackStyle} />
      <Animated.View style={[indicatorStyle, { transform: [{ rotate }] }]} />
      {variant === "dual" ? (
        <Animated.View style={[secondIndicatorStyle, { transform: [{ rotate }] }]} />
      ) : null}
    </View>
  )
}

export function Spinner({ style: userStyle, testID, ...options }: NativeSpinnerProps) {
  const { theme } = useMarwesTheme()
  const kit = createSpinnerRecipe(options)
  const tokens = useMemo(() => resolveSpinnerNativeTokens(theme), [theme])
  const spin = useRef(new Animated.Value(0)).current
  const variant = kit.dataAttributes["data-variant"]
  const size =
    typeof options.size === "number"
      ? options.size
      : options.size
        ? resolveSpinnerSize(options.size)
        : tokens.base.size
  const duration = tokens.motion.rotationDurationMs

  useEffect(() => {
    spin.setValue(0)
    const animation = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    )
    animation.start()

    return () => {
      animation.stop()
    }
  }, [duration, spin])

  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  })

  const rootStyle: ViewStyle = {
    width: size,
    height: size,
    alignItems: "center",
    justifyContent: "center",
  }

  const hidden = kit.a11y.ariaHidden === true
  const accessibilityProps: ViewProps = hidden
    ? {
        accessible: false,
        accessibilityElementsHidden: true,
        importantForAccessibility: "no-hide-descendants",
      }
    : {
        accessible: true,
        accessibilityRole: "progressbar",
        accessibilityLabel: kit.a11y.ariaLabel,
        accessibilityLiveRegion: kit.a11y.ariaLive === "polite" ? "polite" : undefined,
      }

  return (
    <View {...accessibilityProps} testID={testID} style={[rootStyle, userStyle]}>
      {isSegmentVariant(variant) ? (
        <SpinnerSegments
          variant={variant}
          size={size}
          color={tokens.colors.indicator}
          rotate={rotate}
        />
      ) : (
        <RingSpinner
          indicatorColor={tokens.colors.indicator}
          rotate={rotate}
          size={size}
          trackColor={tokens.colors.track}
          variant={variant}
        />
      )}
    </View>
  )
}
