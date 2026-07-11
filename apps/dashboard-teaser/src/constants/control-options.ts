import { type Density, type SegmentedControlItem, ThemeMode } from "@marwes-ui/react"
import type { ThemeMode as ThemeModeValue } from "@marwes-ui/react"

import type { PlaygroundColorVision } from "../sections/playground-settings"

const themeModeItems: SegmentedControlItem<ThemeModeValue>[] = [
  { value: ThemeMode.light, label: "Light" },
  { value: ThemeMode.dark, label: "Dark" },
]

const densityOptions: Array<{ value: Density; label: string }> = [
  { value: "compact", label: "Compact" },
  { value: "comfortable", label: "Comfortable" },
  { value: "spacious", label: "Spacious" },
]

const colorVisionOptionsDetailed: Array<{ value: PlaygroundColorVision; label: string }> = [
  { value: "normal", label: "Normal" },
  { value: "protanopia", label: "Protanopia — red-weak" },
  { value: "deuteranopia", label: "Deuteranopia — green-weak" },
  { value: "tritanopia", label: "Tritanopia — blue-weak" },
  { value: "achromatopsia", label: "Achromatopsia — no colour" },
]

export { colorVisionOptionsDetailed, densityOptions, themeModeItems }
