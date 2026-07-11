import type {
  PersonalityName,
  ThemeInput,
  ThemeMode as ThemeModeValue,
  ToneName,
} from "@marwes-ui/react"

import { baselineColorsByMode } from "./design-md-data"
import { createAccessibilityColorOverrides } from "./playground-a11y"
import { dyslexicFontFamily, dyslexicFontStack, resolveFontStack } from "./playground-fonts"
import type { PlaygroundAccessibilitySettings, PlaygroundSettings } from "./playground-settings"
import { styleToneMap } from "./playground-settings"

type ResolvedDashboardColors = Record<string, string> & {
  primary: string
  danger: string
  success: string
  warning: string
  background: string
  surface: string
  surfaceElevated: string
  text: string
  textMuted: string
  border: string
  borderStrong: string
  focus: string
}

type ResolvedDashboardTheme = {
  mode: ThemeModeValue
  tone: ToneName
  personality: PersonalityName
  color: ResolvedDashboardColors
  ui: {
    radius: number
    density: PlaygroundSettings["density"]
  }
  font: {
    family: string
    primary: string
    source: "fontsource" | "google-fonts"
  }
  accessibility: PlaygroundAccessibilitySettings
  themeInput: ThemeInput
}

function resolveStringColorOverrides(
  overrides: NonNullable<ThemeInput["color"]> | undefined,
): Record<string, string> {
  if (!overrides) return {}

  return Object.fromEntries(
    Object.entries(overrides).flatMap(([key, value]) => {
      if (typeof value === "string") return [[key, value]]
      if (value && typeof value === "object" && "base" in value) return [[key, value.base]]
      return []
    }),
  )
}

function resolveDashboardTheme(
  settings: PlaygroundSettings,
  mode: ThemeModeValue = settings.mode,
  fallbackPersonality: PersonalityName = "flat",
): ResolvedDashboardTheme {
  const modeOverrides = resolveStringColorOverrides(settings.colorOverrides?.[mode])
  const accessibilityOverrides = resolveStringColorOverrides(
    createAccessibilityColorOverrides(settings, mode),
  )
  const color: ResolvedDashboardColors = {
    ...baselineColorsByMode[mode],
    ...settings.colors,
    ...modeOverrides,
    ...accessibilityOverrides,
  }
  const font = settings.accessibility.dyslexicFont
    ? {
        family: dyslexicFontFamily,
        primary: dyslexicFontStack,
        source: "fontsource" as const,
      }
    : {
        family: settings.font,
        primary: resolveFontStack(settings.font),
        source: "google-fonts" as const,
      }
  const tone = styleToneMap[settings.style]
  const personality = settings.personality ?? fallbackPersonality
  const themeInput: ThemeInput = {
    mode,
    tone,
    personality,
    color,
    ui: {
      radius: settings.radius,
      density: settings.density,
    },
    font: { primary: font.primary },
  }

  return {
    mode,
    tone,
    personality,
    color,
    ui: themeInput.ui as ResolvedDashboardTheme["ui"],
    font,
    accessibility: settings.accessibility,
    themeInput,
  }
}

function createDashboardThemeInput(settings: PlaygroundSettings): ThemeInput {
  return resolveDashboardTheme(settings).themeInput
}

export { createDashboardThemeInput, resolveDashboardTheme }
export type { ResolvedDashboardColors, ResolvedDashboardTheme }
