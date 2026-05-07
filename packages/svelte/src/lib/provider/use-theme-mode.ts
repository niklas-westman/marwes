import { ThemeMode } from "@marwes-ui/core"
import type { ThemePreference } from "@marwes-ui/core"
import { getMarwesContext } from "./context.js"

export interface ThemeModeContextValue {
  readonly mode: ThemeMode
  readonly preference: ThemePreference
  readonly systemMode: ThemeMode
  readonly isDark: boolean
  readonly isLight: boolean
  readonly isSystem: boolean
  setMode: (mode: ThemeMode) => void
  setPreference: (preference: ThemePreference) => void
  toggleMode: () => void
}

/**
 * Returns reactive theme mode state and setters.
 * Must be called inside a component rendered within MarwesProvider.
 *
 * All properties are getters that stay reactive:
 * ```ts
 * const themeMode = useThemeMode();
 * // themeMode.isDark, themeMode.mode, themeMode.toggleMode()
 * ```
 */
export function useThemeMode(): ThemeModeContextValue {
  const ctx = getMarwesContext()

  return {
    get mode() {
      return ctx.state.mode
    },
    get preference() {
      return ctx.state.preference
    },
    get systemMode() {
      return ctx.state.systemMode
    },
    get isDark() {
      return ctx.state.mode === ThemeMode.dark
    },
    get isLight() {
      return ctx.state.mode === ThemeMode.light
    },
    get isSystem() {
      return ctx.state.preference === "system"
    },
    setMode: ctx.setMode,
    setPreference: ctx.setPreference,
    toggleMode: ctx.toggleMode,
  }
}
