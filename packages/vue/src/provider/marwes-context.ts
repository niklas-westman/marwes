import type { ResolvedTheme, ThemeMode } from "@marwes-ui/core"
import type { ComputedRef, InjectionKey } from "vue"

export type MarwesContextValue = {
  theme: ComputedRef<ResolvedTheme>
  onModeChange: ((mode: ThemeMode) => void) | undefined
}

export const marwesContextKey: InjectionKey<MarwesContextValue> = Symbol("MarwesContext")
