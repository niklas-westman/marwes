import { ThemeMode, type ThemeMode as ThemeModeValue } from "@marwes-ui/react"

import {
  type ThemePreset,
  type ThemePresetColorOverridesByMode,
  resolveColorOverridesForMode,
} from "../sections/theme-presets"

type NeutralSwatchDefaults = {
  background: string
  surface: string
  text: string
}

const lightSwatchDefaults: NeutralSwatchDefaults = {
  background: "#FFFFFF",
  surface: "#F8F8F8",
  text: "#141414",
}

const darkSwatchDefaults: NeutralSwatchDefaults = {
  background: "#0A0A0A",
  surface: "#141414",
  text: "#F4F4F5",
}

function getNeutralSwatchDefaults(mode: ThemeModeValue): NeutralSwatchDefaults {
  return mode === ThemeMode.dark ? darkSwatchDefaults : lightSwatchDefaults
}

const asString = (value: unknown): string | undefined =>
  typeof value === "string" ? value : undefined

/**
 * Resolves the 4-chip swatch tuple (background, surface, primary, text) for a
 * card by walking a `ThemePresetColorOverridesByMode` payload — the same
 * shape used by every preset AND by the live `settings.colorOverrides`. When
 * an override is absent (or non-string, since primary can be a rich object),
 * we fall back to the neutral defaults for the given mode.
 */
function resolveSwatchColors(
  overrides: ThemePresetColorOverridesByMode | undefined,
  mode: ThemeModeValue,
  fallbackPrimary: string,
  neutralDefaults: NeutralSwatchDefaults,
): readonly [string, string, string, string] {
  const modeOverrides = resolveColorOverridesForMode(overrides, mode)

  return [
    asString(modeOverrides?.background) ?? neutralDefaults.background,
    asString(modeOverrides?.surfaceElevated) ??
      asString(modeOverrides?.surface) ??
      neutralDefaults.surface,
    asString(modeOverrides?.primary) ?? fallbackPrimary,
    asString(modeOverrides?.text) ?? neutralDefaults.text,
  ]
}

function getPresetSwatchColors(preset: ThemePreset, mode: ThemeModeValue): readonly string[] {
  return resolveSwatchColors(
    preset.colorOverrides,
    mode,
    preset.primary,
    getNeutralSwatchDefaults(mode),
  )
}

export { getNeutralSwatchDefaults, getPresetSwatchColors, resolveSwatchColors }
export type { NeutralSwatchDefaults }
