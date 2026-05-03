import { ThemeMode } from "./theme-types"
import type { ThemePreference } from "./theme-types"

export type SystemThemeMode = ThemeMode

export function isThemeMode(value: unknown): value is ThemeMode {
  return value === ThemeMode.light || value === ThemeMode.dark
}

export function isThemePreference(value: unknown): value is ThemePreference {
  return isThemeMode(value) || value === "system"
}

export function resolveThemePreference(
  preference: ThemePreference,
  systemMode: SystemThemeMode,
): ThemeMode {
  return preference === "system" ? systemMode : preference
}

export function nextThemeMode(mode: ThemeMode): ThemeMode {
  return mode === ThemeMode.dark ? ThemeMode.light : ThemeMode.dark
}
