import { type SkeletonOptions, createSkeletonRecipe } from "@marwes-ui/core"
import { useEffect, useMemo, useRef } from "react"
import {
  Animated,
  type DimensionValue,
  Easing,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from "react-native"
import { useMarwesTheme } from "../../provider/marwes-native-context"
import { resolveSkeletonNativeTokens } from "../../styles/native-tokens/generated/first-edition.native-tokens"

export type NativeSkeletonProps = SkeletonOptions & {
  style?: StyleProp<ViewStyle>
  testID?: string
}

function toNativeDimension(value: string | number | undefined): DimensionValue | undefined {
  if (value === undefined) return undefined
  if (typeof value === "number") return value

  const pxMatch = value.match(/^(-?\d+(?:\.\d+)?)px$/)
  if (pxMatch?.[1]) return Number.parseFloat(pxMatch[1])

  return value as DimensionValue
}

function toNativeRadius(value: string | number | undefined, fallback: number): number {
  const dimension = toNativeDimension(value)
  return typeof dimension === "number" ? dimension : fallback
}

export function Skeleton({ style: userStyle, testID, ...options }: NativeSkeletonProps) {
  const { theme } = useMarwesTheme()
  const kit = createSkeletonRecipe(options)
  const tokens = useMemo(() => resolveSkeletonNativeTokens(theme), [theme])
  const opacity = useRef(new Animated.Value(1)).current
  const shimmer = useRef(new Animated.Value(0)).current

  const variant = kit.dataAttributes["data-variant"]
  const animation = kit.dataAttributes["data-animation"]
  const variantTokens = tokens.variants[variant]
  const width = toNativeDimension(options.width) ?? variantTokens.width
  const height = toNativeDimension(options.height) ?? variantTokens.height
  const borderRadius =
    variant === "circular"
      ? tokens.base.circularRadius
      : toNativeRadius(options.radius, tokens.base.radius)

  useEffect(() => {
    if (animation !== "pulse") {
      opacity.setValue(1)
      return
    }

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: tokens.base.pulseMinOpacity,
          duration: tokens.base.pulseDurationMs / 2,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: tokens.base.pulseDurationMs / 2,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    )
    pulse.start()

    return () => pulse.stop()
  }, [animation, opacity, tokens.base.pulseDurationMs, tokens.base.pulseMinOpacity])

  useEffect(() => {
    if (animation !== "wave") {
      shimmer.setValue(0)
      return
    }

    const wave = Animated.loop(
      Animated.timing(shimmer, {
        toValue: 1,
        duration: tokens.base.waveDurationMs,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    )
    wave.start()

    return () => wave.stop()
  }, [animation, shimmer, tokens.base.waveDurationMs])

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

  const rootStyle: ViewStyle = {
    width,
    height,
    minWidth: 1,
    minHeight: 1,
    overflow: "hidden",
    borderRadius,
    backgroundColor: tokens.base.baseColor,
  }

  const translateX = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [-120, 120],
  })

  return (
    <Animated.View
      {...accessibilityProps}
      testID={testID}
      style={[rootStyle, animation === "pulse" ? { opacity } : null, userStyle]}
    >
      {animation === "wave" ? (
        <Animated.View
          style={{
            width: "50%",
            height: "100%",
            backgroundColor: tokens.base.highlightColor,
            opacity: 0.45,
            transform: [{ translateX }],
          }}
        />
      ) : null}
    </Animated.View>
  )
}
