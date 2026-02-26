import type { System, ThemeMode } from "@marwes-ui/core"
import type { ComputedRef, InjectionKey } from "vue"

export type MarwesContextValue = {
  system: ComputedRef<System>
  onModeChange: ((mode: ThemeMode) => void) | undefined
}

export const marwesContextKey: InjectionKey<MarwesContextValue> = Symbol("MarwesContext")
