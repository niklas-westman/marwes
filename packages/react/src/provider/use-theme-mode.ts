import type { ThemeMode } from "@marwes-ui/core"
import * as React from "react"
import { MarwesContext } from "./marwes-context"

export type ThemeModeContextValue = {
  mode: ThemeMode
  setMode: (mode: ThemeMode) => void
  toggleMode: () => void
  isDark: boolean
  isLight: boolean
}

export function useThemeMode(): ThemeModeContextValue {
  const ctx = React.useContext(MarwesContext)

  if (!ctx) {
    throw new Error("MarwesProvider is missing. Wrap your app in <MarwesProvider />.")
  }

  return {
    mode: ctx.mode,
    setMode: ctx.setMode,
    toggleMode: ctx.toggleMode,
    isDark: ctx.mode === "dark",
    isLight: ctx.mode === "light",
  }
}
