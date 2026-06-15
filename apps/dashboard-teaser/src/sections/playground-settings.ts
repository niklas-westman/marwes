import type { Density, ThemeInput, ThemeMode as ThemeModeValue, ToneName } from "@marwes-ui/react"
import { ThemeMode } from "@marwes-ui/react"

type PlaygroundStyle = "marwes" | "cyber" | "mono"
type PlaygroundFont = "default" | "instrument" | "mono" | "nunito" | "editorial"

type ComponentDisplayOptions = {
  showLabels: boolean
  showDescriptions: boolean
  showIcons: boolean
  showHelperText: boolean
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
  return {
    mode: settings.mode,
    tone: styleToneMap[settings.style],
    color: {
      primary: settings.colors.primary,
      danger: settings.colors.danger,
      success: settings.colors.success,
      warning: settings.colors.warning,
    },
    ui: {
      radius: settings.radius,
      density: settings.density,
    },
    ...(settings.font !== "default" ? { font: { primary: fontStacks[settings.font] } } : {}),
  }
}

export { applyPlaygroundStyle, createDashboardThemeInput, defaultPlaygroundSettings, fontStacks }
export type {
  ComponentDisplayOptions,
  PlaygroundColorSettings,
  PlaygroundFont,
  PlaygroundSettings,
  PlaygroundStyle,
}
