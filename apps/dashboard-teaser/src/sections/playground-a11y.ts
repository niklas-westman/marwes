import type { ThemeInput, ThemeMode as ThemeModeValue } from "@marwes-ui/react"
import { ThemeMode } from "@marwes-ui/react"

import type { PlaygroundSettings } from "./playground-settings"

type DashboardColorOverrides = NonNullable<ThemeInput["color"]>

const highContrastNeutralByMode: Record<ThemeModeValue, string> = {
  [ThemeMode.light]: "#141414",
  [ThemeMode.dark]: "#FFFFFF",
}

function createHighContrastColorOverrides(mode: ThemeModeValue): DashboardColorOverrides {
  const foreground = highContrastNeutralByMode[mode]

  return {
    textMuted: foreground,
    textSubtle: foreground,
    iconMuted: foreground,
    borderLow: foreground,
    border: foreground,
    borderSubtle: foreground,
    borderStrong: foreground,
    borderFull: foreground,
  }
}

function createAccessibilityColorOverrides(
  settings: PlaygroundSettings,
  mode: ThemeModeValue = settings.mode,
): DashboardColorOverrides {
  return settings.accessibility.highContrast ? createHighContrastColorOverrides(mode) : {}
}

export { createAccessibilityColorOverrides }
