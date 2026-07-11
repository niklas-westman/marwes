import { type Density, type SegmentedControlItem, ThemeMode } from "@marwes-ui/react"
import type { ThemeMode as ThemeModeValue } from "@marwes-ui/react"

import type {
  PlaygroundColorVision,
  PlaygroundFont,
  PlaygroundStyle,
} from "../sections/playground-settings"

const themeModeItems: SegmentedControlItem<ThemeModeValue>[] = [
  { value: ThemeMode.light, label: "Light" },
  { value: ThemeMode.dark, label: "Dark" },
]

const styleItems: SegmentedControlItem<PlaygroundStyle>[] = [
  { value: "marwes", label: "Marwes" },
  { value: "cyber", label: "Cyber" },
  { value: "mono", label: "Mono" },
]

const fontOptions: Array<{ value: PlaygroundFont; label: string }> = [
  { value: "default", label: "Theme default" },
  { value: "instrument", label: "Instrument Sans" },
  { value: "mono", label: "Fira Code" },
  { value: "nunito", label: "Nunito" },
  { value: "editorial", label: "Playfair Display" },
]

const densityOptions: Array<{ value: Density; label: string }> = [
  { value: "compact", label: "Compact" },
  { value: "comfortable", label: "Comfortable" },
  { value: "spacious", label: "Spacious" },
]

const colorVisionOptions: Array<{ value: PlaygroundColorVision; label: string }> = [
  { value: "normal", label: "Normal" },
  { value: "protanopia", label: "Protanopia" },
  { value: "deuteranopia", label: "Deuteranopia" },
  { value: "tritanopia", label: "Tritanopia" },
]

const colorVisionOptionsDetailed: Array<{ value: PlaygroundColorVision; label: string }> = [
  { value: "normal", label: "Normal" },
  { value: "protanopia", label: "Protanopia — red-weak" },
  { value: "deuteranopia", label: "Deuteranopia — green-weak" },
  { value: "tritanopia", label: "Tritanopia — blue-weak" },
  { value: "achromatopsia", label: "Achromatopsia — no colour" },
]

const fontStyleItems: SegmentedControlItem<"default" | "dyslexic">[] = [
  { value: "default", label: "Default" },
  { value: "dyslexic", label: "Dyslexic" },
]

const letterSpacingItems: SegmentedControlItem<"default" | "loose">[] = [
  { value: "default", label: "Default" },
  { value: "loose", label: "Loose" },
]

export {
  colorVisionOptions,
  colorVisionOptionsDetailed,
  densityOptions,
  fontOptions,
  fontStyleItems,
  letterSpacingItems,
  styleItems,
  themeModeItems,
}
