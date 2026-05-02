import type { ThemeMode } from "@marwes-ui/core"
import type { ComputedRef } from "vue"
import { computed, inject } from "vue"
import { marwesContextKey } from "./marwes-context"

export type ThemeModeContextValue = {
  mode: ComputedRef<ThemeMode>
  setMode: (mode: ThemeMode) => void
  toggleMode: () => void
  isDark: ComputedRef<boolean>
  isLight: ComputedRef<boolean>
}

export function useThemeMode(): ThemeModeContextValue {
  const context = inject(marwesContextKey, null)

  if (!context) {
    throw new Error("MarwesProvider is missing. Wrap your app in <MarwesProvider />.")
  }

  return {
    mode: context.mode,
    setMode: context.setMode,
    toggleMode: context.toggleMode,
    isDark: computed(() => context.mode.value === "dark"),
    isLight: computed(() => context.mode.value === "light"),
  }
}
