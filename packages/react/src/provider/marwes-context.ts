import type { ResolvedTheme, ThemeMode } from "@marwes-ui/core"
import * as React from "react"

export type MarwesContextValue = {
  theme: ResolvedTheme
  mode: ThemeMode
  setMode: (mode: ThemeMode) => void
  toggleMode: () => void
}

export const MarwesContext = React.createContext<MarwesContextValue | null>(null)
