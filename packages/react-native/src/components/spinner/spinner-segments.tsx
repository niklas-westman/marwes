import type { SpinnerVariant } from "@marwes-ui/core"
import { Animated, View, type ViewStyle } from "react-native"

type SpinnerSegmentsProps = {
  variant: SpinnerVariant
  size: number
  color: string
  rotate: Animated.AnimatedInterpolation<string>
}

const opacities4 = [1, 0.6, 0.4, 0.2]
const opacities8 = [0.89375, 0.46875, 0.3625, 0.15, 0.575, 0.7875, 0.68125, 0.25625]

function getAngles(count: number): number[] {
  return Array.from({ length: count }, (_, index) => (360 / count) * index)
}

function segmentStyle({
  angle,
  color,
  index,
  opacity,
  radius,
  segmentHeight,
  segmentWidth,
  size,
  square,
}: {
  angle: number
  color: string
  index: number
  opacity: number
  radius: number
  segmentHeight: number
  segmentWidth: number
  size: number
  square: boolean
}): ViewStyle {
  const radians = (angle * Math.PI) / 180
  const center = size / 2
  const x = center + Math.sin(radians) * radius - segmentWidth / 2
  const y = center - Math.cos(radians) * radius - segmentHeight / 2

  return {
    position: "absolute",
    left: x,
    top: y,
    width: segmentWidth,
    height: segmentHeight,
    borderRadius: square ? Math.max(1, segmentWidth * 0.25) : segmentWidth / 2,
    backgroundColor: color,
    opacity,
    transform: [{ rotate: `${angle}deg` }],
    zIndex: index,
  }
}

export function SpinnerSegments({ variant, size, color, rotate }: SpinnerSegmentsProps) {
  const isCross = variant === "cross"
  const isDots = variant === "dots-round" || variant === "dots-square"
  const count = isCross ? 4 : 8
  const opacities = isCross ? opacities4 : opacities8
  const radius = isCross ? size * 0.27 : size * 0.35
  const segmentWidth = isDots ? size * 0.16 : isCross ? size * 0.28 : size * 0.085
  const segmentHeight = isDots ? size * 0.16 : isCross ? size * 0.14 : size * 0.25
  const square = variant === "dots-square" || variant === "lines" || isCross

  const containerStyle: ViewStyle = {
    width: size,
    height: size,
  }

  return (
    <Animated.View style={[containerStyle, { transform: [{ rotate }] }]}>
      {getAngles(count).map((angle, index) => (
        <View
          key={`${variant}-${angle}`}
          style={segmentStyle({
            angle,
            color,
            index,
            opacity: opacities[index] ?? 1,
            radius,
            segmentHeight,
            segmentWidth,
            size,
            square,
          })}
        />
      ))}
    </Animated.View>
  )
}
