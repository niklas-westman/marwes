import type {
  Density,
  PersonalityName,
  ThemeInput,
  ThemeMode as ThemeModeValue,
  ToneName,
} from "@marwes-ui/react"
import { ThemeMode } from "@marwes-ui/react"

import { createAccessibilityColorOverrides } from "./playground-a11y"
import { dyslexicFontStack, resolveFontStack } from "./playground-fonts"

type PlaygroundStyle = "marwes" | "cyber" | "mono"
/**
 * A plain Google Fonts family name (e.g. "Instrument Sans", "Rubik").
 * The dashboard combobox writes any family from the shipped
 * `google-fonts.json` list into this field.
 */
type PlaygroundFont = string
type PlaygroundColorVision =
  | "normal"
  | "protanopia"
  | "deuteranopia"
  | "tritanopia"
  | "achromatopsia"

type ComponentDisplayOptions = {
  showLabels: boolean
  showDescriptions: boolean
  showIcons: boolean
  showHelperText: boolean
}

type PlaygroundAccessibilitySettings = {
  highContrast: boolean
  reduceMotion: boolean
  dyslexicFont: boolean
  looseSpacing: boolean
  colorVision: PlaygroundColorVision
}

type PlaygroundColorSettings = {
  primary: string
  danger: string
  success: string
  warning: string
}

/**
 * Preset-supplied `Partial<ThemeInputColor>` overlays, one per mode. Kept
 * as a pair so the header light/dark toggle can swap the active variant
 * without losing the preset selection.
 */
type PlaygroundColorOverridesByMode = {
  light?: NonNullable<ThemeInput["color"]>
  dark?: NonNullable<ThemeInput["color"]>
}

type PlaygroundSettings = {
  selectedPresetId?: string
  mode: ThemeModeValue
  style: PlaygroundStyle
  font: PlaygroundFont
  colors: PlaygroundColorSettings
  radius: number
  density: Density
  personality?: PersonalityName
  accessibility: PlaygroundAccessibilitySettings
  componentOptions: ComponentDisplayOptions
  colorOverrides?: PlaygroundColorOverridesByMode
}

const defaultPlaygroundSettings: PlaygroundSettings = {
  selectedPresetId: "marwes",
  mode: ThemeMode.light,
  style: "marwes",
  font: "Instrument Sans",
  colors: {
    primary: "#2F31FC",
    danger: "#D90429",
    success: "#006633",
    warning: "#B45309",
  },
  radius: 4,
  density: "comfortable",
  accessibility: {
    highContrast: false,
    reduceMotion: false,
    dyslexicFont: false,
    looseSpacing: false,
    colorVision: "normal",
  },
  componentOptions: {
    showLabels: true,
    showDescriptions: true,
    showIcons: true,
    showHelperText: true,
  },
}

const styleToneMap: Record<PlaygroundStyle, ToneName> = {
  marwes: "default",
  cyber: "digital",
  mono: "default",
}

function resolvePrimaryFont(settings: PlaygroundSettings): string | undefined {
  if (settings.accessibility.dyslexicFont) return dyslexicFontStack
  if (!settings.font) return undefined
  return resolveFontStack(settings.font)
}

function applyPlaygroundStyle(
  settings: PlaygroundSettings,
  style: PlaygroundStyle,
): PlaygroundSettings {
  if (style === "cyber") {
    return { ...settings, style, font: "Fira Code", radius: 0 }
  }

  if (style === "mono") {
    return { ...settings, style, font: "Fira Code", radius: 4 }
  }

  return { ...settings, style, font: "Instrument Sans", radius: 4 }
}

function createDashboardThemeInput(settings: PlaygroundSettings): ThemeInput {
  const a11yOverrides = createAccessibilityColorOverrides(settings)
  const presetOverrides = settings.colorOverrides?.[settings.mode] ?? {}
  const primaryFont = resolvePrimaryFont(settings)

  return {
    mode: settings.mode,
    tone: styleToneMap[settings.style],
    personality: settings.personality ?? "flat",
    color: {
      primary: settings.colors.primary,
      danger: settings.colors.danger,
      success: settings.colors.success,
      warning: settings.colors.warning,
      ...presetOverrides,
      ...a11yOverrides,
    },
    ui: {
      radius: settings.radius,
      density: settings.density,
    },
    ...(primaryFont ? { font: { primary: primaryFont } } : {}),
  }
}

export { applyPlaygroundStyle, createDashboardThemeInput, defaultPlaygroundSettings, styleToneMap }
export type {
  ComponentDisplayOptions,
  PlaygroundAccessibilitySettings,
  PlaygroundColorOverridesByMode,
  PlaygroundColorSettings,
  PlaygroundColorVision,
  PlaygroundFont,
  PlaygroundSettings,
  PlaygroundStyle,
}
