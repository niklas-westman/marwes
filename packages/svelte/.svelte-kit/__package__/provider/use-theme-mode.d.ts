import { ThemeMode } from "@marwes-ui/core";
import type { ThemePreference } from "@marwes-ui/core";
export interface ThemeModeContextValue {
    readonly mode: ThemeMode;
    readonly preference: ThemePreference;
    readonly systemMode: ThemeMode;
    readonly isDark: boolean;
    readonly isLight: boolean;
    readonly isSystem: boolean;
    setMode: (mode: ThemeMode) => void;
    setPreference: (preference: ThemePreference) => void;
    toggleMode: () => void;
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
export declare function useThemeMode(): ThemeModeContextValue;
