import type {
  Density,
  PersonalityName,
  ThemeInput,
  ThemeMode as ThemeModeValue,
} from "@marwes-ui/react"
import { ThemeMode } from "@marwes-ui/react"

import type { PlaygroundFont, PlaygroundSettings, PlaygroundStyle } from "./playground-settings"

type ThemePresetColorOverrides = NonNullable<ThemeInput["color"]>

/**
 * A preset ships a palette variant per mode. When the shell mode toggles
 * (via the header light/dark button), the preview picks the matching
 * variant and the preset stays selected — so Cyber-dark and Cyber-light are
 * two faces of the same identity, not two separate presets.
 */
type ThemePresetColorOverridesByMode = {
  light?: ThemePresetColorOverrides
  dark?: ThemePresetColorOverrides
}

type ThemePresetId = "marwes" | "cyber" | "editorial" | "sunset" | "custom"

type ThemePreset = {
  id: ThemePresetId
  name: string
  description: string
  style: PlaygroundStyle
  font: PlaygroundFont
  primary: string
  radius: number
  density: Density
  /**
   * Mode applied when the user clicks this preset fresh. Not a constraint —
   * the header toggle can flip mode afterwards and the preset stays active,
   * using the opposite `colorOverrides` variant.
   */
  defaultMode: ThemeModeValue
  personality: PersonalityName
  gradientFrom: string
  gradientTo: string
  foregroundOnPrimary: string
  colorOverrides?: ThemePresetColorOverridesByMode
}

const themePresets: readonly [ThemePreset, ...ThemePreset[]] = [
  {
    id: "marwes",
    name: "Marwes",
    description: "Clean, precise, quietly confident.",
    style: "marwes",
    font: "Instrument Sans",
    primary: "#2F31FC",
    radius: 4,
    density: "comfortable",
    defaultMode: ThemeMode.light,
    personality: "flat",
    gradientFrom: "#2F31FC",
    gradientTo: "#6D6EFF",
    foregroundOnPrimary: "#FFFFFF",
    // No overrides — Marwes inherits firstEdition defaults for both modes.
  },
  {
    id: "cyber",
    name: "Cyber",
    description: "High-contrast, built for dashboards and dev tools.",
    style: "cyber",
    font: "Fira Code",
    primary: "#FFE500",
    radius: 0,
    density: "compact",
    defaultMode: ThemeMode.dark,
    personality: "glow",
    gradientFrom: "#FFE500",
    gradientTo: "#1A1A1A",
    foregroundOnPrimary: "#111111",
    colorOverrides: {
      dark: {
        background: "#0A0A0F",
        surface: "#12121A",
        surfaceElevated: "#1B1B26",
        text: "#F4F4F5",
        textMuted: "#A1A1AA",
        border: "#27272A",
        borderStrong: "#3F3F46",
      },
      light: {
        background: "#F5F5F0",
        surface: "#FFFFFF",
        surfaceElevated: "#FFFFFF",
        text: "#0A0A0F",
        textMuted: "#52525B",
        border: "#D4D4D8",
        borderStrong: "#71717A",
      },
    },
  },
  {
    id: "editorial",
    name: "Editorial",
    description: "Serif type and ink rules for content-led products.",
    style: "marwes",
    font: "Playfair Display",
    primary: "#8B1E3F",
    radius: 12,
    density: "spacious",
    defaultMode: ThemeMode.light,
    personality: "outlined",
    gradientFrom: "#8B1E3F",
    gradientTo: "#E9C9BE",
    foregroundOnPrimary: "#FFFFFF",
    colorOverrides: {
      light: {
        background: "#FBF7F0",
        surface: "#FFFFFF",
        text: "#1B1B1F",
        textMuted: "#5C5C63",
        border: "#E5DFD2",
        borderStrong: "#C6BFB0",
      },
      dark: {
        background: "#1B1B1F",
        surface: "#242428",
        surfaceElevated: "#2E2E32",
        text: "#FBF7F0",
        textMuted: "#A8A29E",
        border: "#3A3A3E",
        borderStrong: "#5C5C63",
      },
    },
  },
  {
    id: "sunset",
    name: "Sunset",
    description: "Warm, rounded, and friendly.",
    style: "marwes",
    font: "Nunito",
    primary: "#F97316",
    radius: 16,
    density: "comfortable",
    defaultMode: ThemeMode.light,
    personality: "soft",
    gradientFrom: "#F97316",
    gradientTo: "#FED7AA",
    foregroundOnPrimary: "#FFFFFF",
    colorOverrides: {
      light: {
        background: "#FFF8F2",
        surface: "#FFFFFF",
        text: "#2B1E17",
        textMuted: "#8B6E5A",
        border: "#F5DFC7",
        borderStrong: "#E9C29A",
      },
      dark: {
        background: "#1F1611",
        surface: "#2B1E17",
        surfaceElevated: "#3A2820",
        text: "#FFF8F2",
        textMuted: "#D4AB88",
        border: "#4A3628",
        borderStrong: "#8B6E5A",
      },
    },
  },
  {
    id: "custom",
    name: "Custom",
    description: "Open the builder to make it yours.",
    style: "mono",
    font: "Fira Code",
    primary: "#475569",
    radius: 2,
    density: "compact",
    defaultMode: ThemeMode.light,
    personality: "outlined",
    gradientFrom: "#475569",
    gradientTo: "#CBD5E1",
    foregroundOnPrimary: "#FFFFFF",
    colorOverrides: {
      light: {
        background: "#F1F5F9",
        surface: "#F8FAFC",
        text: "#0F172A",
        textMuted: "#64748B",
        border: "#CBD5E1",
        borderStrong: "#94A3B8",
      },
      dark: {
        background: "#0F172A",
        surface: "#1E293B",
        surfaceElevated: "#293548",
        text: "#F1F5F9",
        textMuted: "#94A3B8",
        border: "#334155",
        borderStrong: "#64748B",
      },
    },
  },
]

/**
 * Applies a preset to the preview *without* touching `settings.mode` — that
 * field belongs to the header light/dark toggle and is intentionally
 * orthogonal to preset choice. The preset's `defaultMode` is a hint for
 * documentation/UI copy, not a value we write into settings.
 */
function applyThemePreset(settings: PlaygroundSettings, preset: ThemePreset): PlaygroundSettings {
  return {
    ...settings,
    selectedPresetId: preset.id,
    style: preset.style,
    font: preset.font,
    radius: preset.radius,
    density: preset.density,
    personality: preset.personality,
    colors: {
      ...settings.colors,
      primary: preset.primary,
    },
    colorOverrides: preset.colorOverrides,
  }
}

function resolveColorOverridesForMode(
  overrides: ThemePresetColorOverridesByMode | undefined,
  mode: ThemeModeValue,
): ThemePresetColorOverrides | undefined {
  return overrides?.[mode]
}

function shallowEqualColorOverrides(
  a: ThemePresetColorOverrides | undefined,
  b: ThemePresetColorOverrides | undefined,
): boolean {
  if (a === b) return true
  if (!a || !b) return !a && !b
  const aKeys = Object.keys(a) as Array<keyof ThemePresetColorOverrides>
  const bKeys = Object.keys(b) as Array<keyof ThemePresetColorOverrides>
  if (aKeys.length !== bKeys.length) return false
  return aKeys.every((key) => a[key] === b[key])
}

function equalColorOverridesByMode(
  a: ThemePresetColorOverridesByMode | undefined,
  b: ThemePresetColorOverridesByMode | undefined,
): boolean {
  if (a === b) return true
  if (!a || !b) return !a && !b
  return shallowEqualColorOverrides(a.light, b.light) && shallowEqualColorOverrides(a.dark, b.dark)
}

function getActivePresetId(settings: PlaygroundSettings): ThemePresetId | null {
  if (
    settings.selectedPresetId &&
    themePresets.some((preset) => preset.id === settings.selectedPresetId)
  ) {
    return settings.selectedPresetId as ThemePresetId
  }

  const activePersonality = settings.personality ?? "flat"
  const match = themePresets.find(
    (preset) =>
      preset.style === settings.style &&
      preset.font === settings.font &&
      preset.primary === settings.colors.primary &&
      preset.radius === settings.radius &&
      preset.density === settings.density &&
      preset.personality === activePersonality &&
      equalColorOverridesByMode(preset.colorOverrides, settings.colorOverrides),
  )

  return match?.id ?? null
}

export {
  applyThemePreset,
  equalColorOverridesByMode,
  getActivePresetId,
  resolveColorOverridesForMode,
  themePresets,
}
export type {
  ThemePreset,
  ThemePresetColorOverrides,
  ThemePresetColorOverridesByMode,
  ThemePresetId,
}
