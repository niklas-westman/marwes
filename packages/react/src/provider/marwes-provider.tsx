import type { Preset, System, ThemeMode, ThemeOverrides } from "@marwes/core"
import { createSystem, switchMode } from "@marwes/core"
import { firstEdition } from "@marwes/presets"
import * as React from "react"
import { MarwesContext } from "./marwes-context"

export type MarwesProviderProps = {
  preset?: Preset
  theme?: ThemeOverrides
  /**
   * Current theme mode. Determines light or dark color palette.
   * When changed, efficiently switches theme colors without recreating the entire system.
   */
  mode?: ThemeMode
  /**
   * Callback fired when mode should change.
   * Users are responsible for managing mode state and persistence (e.g., localStorage).
   *
   * Example with persistence:
   * ```tsx
   * const [mode, setMode] = useState<ThemeMode>(
   *   () => (localStorage.getItem('theme-mode') as ThemeMode) ?? 'light'
   * );
   *
   * const handleModeChange = (newMode: ThemeMode) => {
   *   setMode(newMode);
   *   localStorage.setItem('theme-mode', newMode);
   * };
   *
   * <MarwesProvider mode={mode} onModeChange={handleModeChange}>
   * ```
   */
  onModeChange?: (mode: ThemeMode) => void
  children: React.ReactNode
}

export function MarwesProvider({
  preset = firstEdition,
  theme,
  mode = "light",
  onModeChange,
  children,
}: MarwesProviderProps) {
  // Create initial system
  const initialSystem = React.useMemo(() => {
    return createSystem({
      preset,
      theme: theme ? { ...theme, mode } : { mode },
    })
  }, [preset, theme, mode])

  // Optimize mode switching using switchMode() instead of recreating system
  const system: System = React.useMemo(() => {
    if (mode === initialSystem.theme.mode) {
      return initialSystem
    }
    return switchMode(initialSystem, mode)
  }, [initialSystem, mode])

  // Apply theme class to container for CSS-based dark mode overrides
  const themeClass = `mw-theme--${system.theme.mode}`

  return (
    <MarwesContext.Provider value={{ system, onModeChange }}>
      <div className={themeClass}>{children}</div>
    </MarwesContext.Provider>
  )
}
