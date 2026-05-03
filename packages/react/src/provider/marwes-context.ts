import type { ResolvedTheme, ThemeMode, ThemePreference } from "@marwes-ui/core"
import * as React from "react"

export type MarwesContextValue = {
  theme: ResolvedTheme
  mode: ThemeMode
  preference: ThemePreference
  systemMode: ThemeMode
  setMode: (mode: ThemeMode) => void
  setPreference: (preference: ThemePreference) => void
  toggleMode: () => void
}

export const MarwesContext = React.createContext<MarwesContextValue | null>(null)
