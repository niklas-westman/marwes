import type { ResolvedTheme, ThemeMode, ThemePreference } from "@marwes-ui/core"
import type { ComputedRef, InjectionKey } from "vue"

export type MarwesContextValue = {
  theme: ComputedRef<ResolvedTheme>
  mode: ComputedRef<ThemeMode>
  preference: ComputedRef<ThemePreference>
  systemMode: ComputedRef<ThemeMode>
  setMode: (mode: ThemeMode) => void
  setPreference: (preference: ThemePreference) => void
  toggleMode: () => void
}

export const marwesContextKey: InjectionKey<MarwesContextValue> = Symbol("MarwesContext")
