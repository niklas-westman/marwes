import { ThemeMode } from "@marwes-ui/core";
import { getMarwesContext } from "./context.js";
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
export function useThemeMode() {
    const ctx = getMarwesContext();
    return {
        get mode() {
            return ctx.state.mode;
        },
        get preference() {
            return ctx.state.preference;
        },
        get systemMode() {
            return ctx.state.systemMode;
        },
        get isDark() {
            return ctx.state.mode === ThemeMode.dark;
        },
        get isLight() {
            return ctx.state.mode === ThemeMode.light;
        },
        get isSystem() {
            return ctx.state.preference === "system";
        },
        setMode: ctx.setMode,
        setPreference: ctx.setPreference,
        toggleMode: ctx.toggleMode,
    };
}
