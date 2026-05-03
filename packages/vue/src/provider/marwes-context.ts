import type { ResolvedTheme, ThemeMode } from "@marwes-ui/core"
import type { ComputedRef, InjectionKey } from "vue"

export type MarwesContextValue = {
  theme: ComputedRef<ResolvedTheme>
  mode: ComputedRef<ThemeMode>
  setMode: (mode: ThemeMode) => void
  toggleMode: () => void
}

export const marwesContextKey: InjectionKey<MarwesContextValue> = Symbol("MarwesContext")
