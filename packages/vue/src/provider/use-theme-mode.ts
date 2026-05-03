import { ThemeMode } from "@marwes-ui/core"
import type { ThemePreference } from "@marwes-ui/core"
import type { ComputedRef } from "vue"
import { computed, inject } from "vue"
import { marwesContextKey } from "./marwes-context"

export type ThemeModeContextValue = {
  mode: ComputedRef<ThemeMode>
  preference: ComputedRef<ThemePreference>
  systemMode: ComputedRef<ThemeMode>
  setMode: (mode: ThemeMode) => void
  setPreference: (preference: ThemePreference) => void
  toggleMode: () => void
  isDark: ComputedRef<boolean>
  isLight: ComputedRef<boolean>
  isSystem: ComputedRef<boolean>
}

export function useThemeMode(): ThemeModeContextValue {
  const context = inject(marwesContextKey, null)

  if (!context) {
    throw new Error("MarwesProvider is missing. Wrap your app in <MarwesProvider />.")
  }

  return {
    mode: context.mode,
    preference: context.preference,
    systemMode: context.systemMode,
    setMode: context.setMode,
    setPreference: context.setPreference,
    toggleMode: context.toggleMode,
    isDark: computed(() => context.mode.value === ThemeMode.dark),
    isLight: computed(() => context.mode.value === ThemeMode.light),
    isSystem: computed(() => context.preference.value === "system"),
  }
}
