import type { ResolvedTheme, ThemeMode } from "@marwes-ui/core"
import * as React from "react"

export type MarwesContextValue = {
  theme: ResolvedTheme
  onModeChange: ((mode: ThemeMode) => void) | undefined
}

export const MarwesContext = React.createContext<MarwesContextValue | null>(null)
