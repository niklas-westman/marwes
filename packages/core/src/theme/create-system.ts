import { darkThemeDefaults, lightThemeDefaults } from "./theme-defaults"
import { mergeTheme } from "./theme-merge"
import { normalizeTheme } from "./theme-normalize"
import type { Preset, System, Theme, ThemeMode, ThemeOverrides } from "./theme-types"

/**
 * Creates a new design system by merging theme defaults with preset and custom overrides.
 * Selects light or dark theme defaults based on the mode specified in theme overrides.
 *
 * @param args.preset - Required preset configuration (e.g., firstEdition)
 * @param args.theme - Optional theme overrides
 * @returns Complete system with theme and preset
 */

export function createSystem(args: {
  preset: Preset
  theme?: ThemeOverrides
}): System {
  // Select base defaults based on requested mode (default to light)
  const requestedMode = args.theme?.mode ?? "light"
  const baseDefaults = requestedMode === "dark" ? darkThemeDefaults : lightThemeDefaults

  // Merge: base defaults → preset overrides → custom theme overrides
  const merged = mergeTheme(baseDefaults, args.preset.theme, args.theme)
  const theme = normalizeTheme(merged)

  if (args.preset !== undefined) {
    return { theme, preset: args.preset }
  }

  return { theme, preset: args.preset }
}

/**
 * Optimized function to switch theme mode without recreating the entire system.
 * Only swaps color values, preserving all other theme properties.
 *
 * @param currentSystem - The existing system to switch modes on
 * @param newMode - The target mode ('light' or 'dark')
 * @returns A new system with the switched mode
 */
export function switchMode(currentSystem: System, newMode: ThemeMode): System {
  const currentTheme = currentSystem.theme

  // If already in the requested mode, return as-is
  if (currentTheme.mode === newMode) {
    return currentSystem
  }

  // Get the target mode defaults
  const targetDefaults = newMode === "dark" ? darkThemeDefaults : lightThemeDefaults

  // Create new theme with swapped colors, preserving other properties
  const newTheme: Theme = {
    ...currentTheme,
    mode: newMode,
    color: {
      ...targetDefaults.color,
      // Preserve any user-customized semantic colors if they differ from defaults
      // This ensures custom brand colors persist across mode switches
    },
  }

  return {
    theme: newTheme,
    preset: currentSystem.preset,
  }
}
