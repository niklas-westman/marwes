import { View, type ViewStyle } from "react-native"

type CheckboxMarkProps = {
  checked: boolean
  mixed: boolean
  color: string
  size: number
}

export function CheckboxMark({ checked, mixed, color, size }: CheckboxMarkProps) {
  if (mixed) {
    const mixedStyle: ViewStyle = {
      width: size * 0.58,
      height: 2,
      borderRadius: 1,
      backgroundColor: color,
    }

    return <View style={mixedStyle} />
  }

  if (!checked) {
    return null
  }

  const strokeWidth = Math.max(2, Math.round(size * 0.12))
  const firstStroke: ViewStyle = {
    position: "absolute",
    width: size * 0.28,
    height: strokeWidth,
    left: size * 0.25,
    top: size * 0.53,
    borderRadius: strokeWidth / 2,
    backgroundColor: color,
    transform: [{ rotate: "45deg" }],
  }
  const secondStroke: ViewStyle = {
    position: "absolute",
    width: size * 0.55,
    height: strokeWidth,
    left: size * 0.38,
    top: size * 0.47,
    borderRadius: strokeWidth / 2,
    backgroundColor: color,
    transform: [{ rotate: "-45deg" }],
  }

  return (
    <>
      <View style={firstStroke} />
      <View style={secondStroke} />
    </>
  )
}
