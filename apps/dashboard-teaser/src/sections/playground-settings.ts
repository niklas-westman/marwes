import type {
  Density,
  PersonalityName,
  ThemeInput,
  ThemeMode as ThemeModeValue,
  ToneName,
} from "@marwes-ui/react"
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

/**
 * The dashboard shell (header, hero, footer) is fixed to the Marwes identity
 * regardless of which preview preset the user has selected. It only picks up
 * two things from settings: the current mode (so the header light/dark
 * toggle still works) and the a11y overrides (high contrast, dyslexic font).
 * All other preset-affected fields — style/primary/radius/font — are
 * intentionally ignored here so the picker only reshapes the showcase.
 */
function createDashboardShellThemeInput(settings: PlaygroundSettings): ThemeInput {
  const colorOverrides = createAccessibilityColorOverrides(settings)
  const primaryFont = settings.accessibility.dyslexicFont ? dyslexicFontStack : undefined

  return {
    mode: settings.mode,
    tone: "default",
    color: {
      primary: "#2F31FC",
      ...colorOverrides,
    },
    ui: { radius: 4 },
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
  PlaygroundColorOverridesByMode,
  PlaygroundColorVision,
  ComponentDisplayOptions,
  PlaygroundColorSettings,
  PlaygroundFont,
  PlaygroundSettings,
  PlaygroundStyle,
}
