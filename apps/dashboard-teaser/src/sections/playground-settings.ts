import type { Density, ThemeInput, ThemeMode as ThemeModeValue, ToneName } from "@marwes-ui/react"
import { ThemeMode } from "@marwes-ui/react"

type PlaygroundStyle = "marwes" | "cyber" | "mono"
type PlaygroundFont = "default" | "instrument" | "mono" | "nunito" | "editorial"
type PlaygroundColorVision = "normal" | "protanopia" | "deuteranopia" | "tritanopia"

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

type PlaygroundSettings = {
  mode: ThemeModeValue
  style: PlaygroundStyle
  font: PlaygroundFont
  colors: PlaygroundColorSettings
  radius: number
  density: Density
  accessibility: PlaygroundAccessibilitySettings
  componentOptions: ComponentDisplayOptions
}

const defaultPlaygroundSettings: PlaygroundSettings = {
  mode: ThemeMode.light,
  style: "marwes",
  font: "default",
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

const fontStacks: Record<Exclude<PlaygroundFont, "default">, string> = {
  instrument: "Instrument Sans, system-ui, -apple-system, sans-serif",
  mono: "Fira Code, ui-monospace, monospace",
  nunito: "Nunito, system-ui, sans-serif",
  editorial: "Playfair Display, Georgia, serif",
}

const styleToneMap: Record<PlaygroundStyle, ToneName> = {
  marwes: "default",
  cyber: "digital",
  mono: "default",
}

const dyslexicFontStack = "Atkinson Hyperlegible, ui-sans-serif, system-ui, sans-serif"

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

function createAccessibilityColorOverrides(settings: PlaygroundSettings): DashboardColorOverrides {
  return settings.accessibility.highContrast ? createHighContrastColorOverrides(settings.mode) : {}
}

function resolvePrimaryFont(settings: PlaygroundSettings): string | undefined {
  if (settings.accessibility.dyslexicFont) return dyslexicFontStack
  if (settings.font === "default") return undefined
  return fontStacks[settings.font]
}

function applyPlaygroundStyle(
  settings: PlaygroundSettings,
  style: PlaygroundStyle,
): PlaygroundSettings {
  if (style === "cyber") {
    return { ...settings, style, font: "mono", radius: 0 }
  }

  if (style === "mono") {
    return { ...settings, style, font: "mono", radius: 4 }
  }

  return { ...settings, style, font: "default", radius: 4 }
}

function createDashboardThemeInput(settings: PlaygroundSettings): ThemeInput {
  const colorOverrides = createAccessibilityColorOverrides(settings)
  const primaryFont = resolvePrimaryFont(settings)

  return {
    mode: settings.mode,
    tone: styleToneMap[settings.style],
    color: {
      primary: settings.colors.primary,
      danger: settings.colors.danger,
      success: settings.colors.success,
      warning: settings.colors.warning,
      ...colorOverrides,
    },
    ui: {
      radius: settings.radius,
      density: settings.density,
    },
    ...(primaryFont ? { font: { primary: primaryFont } } : {}),
  }
}

function createDashboardShellThemeInput(settings: PlaygroundSettings): ThemeInput {
  const colorOverrides = createAccessibilityColorOverrides(settings)
  const primaryFont = settings.accessibility.dyslexicFont ? dyslexicFontStack : undefined

  return {
    mode: settings.mode,
    tone: styleToneMap[settings.style],
    color: {
      primary: settings.colors.primary,
      danger: settings.colors.danger,
      success: settings.colors.success,
      warning: settings.colors.warning,
      ...colorOverrides,
    },
    ui: { radius: settings.radius },
    ...(primaryFont ? { font: { primary: primaryFont } } : {}),
  }
}

export {
  applyPlaygroundStyle,
  createDashboardShellThemeInput,
  createDashboardThemeInput,
  defaultPlaygroundSettings,
  dyslexicFontStack,
  fontStacks,
}
export type {
  PlaygroundAccessibilitySettings,
  PlaygroundColorVision,
  ComponentDisplayOptions,
  PlaygroundColorSettings,
  PlaygroundFont,
  PlaygroundSettings,
  PlaygroundStyle,
}
