import type { System, ThemeMode } from "@marwes-ui/core"
import * as React from "react"

export type MarwesContextValue = {
  system: System
  onModeChange: ((mode: ThemeMode) => void) | undefined
}

export const MarwesContext = React.createContext<MarwesContextValue | null>(null)
