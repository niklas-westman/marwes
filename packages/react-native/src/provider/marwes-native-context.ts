import type { ResolvedTheme, ThemeMode, ThemePreference } from "@marwes-ui/core"
import { createContext, useContext } from "react"

export interface MarwesNativeContextValue {
  theme: ResolvedTheme
  mode: ThemeMode
  preference: ThemePreference
  setMode: (mode: ThemeMode) => void
  setPreference: (preference: ThemePreference) => void
  toggleMode: () => void
}

export const MarwesNativeContext = createContext<MarwesNativeContextValue | null>(null)

export function useMarwesTheme(): MarwesNativeContextValue {
  const ctx = useContext(MarwesNativeContext)
  if (!ctx) {
    throw new Error("[marwes-rn] useMarwesTheme must be used within <MarwesNativeProvider>")
  }
  return ctx
}
