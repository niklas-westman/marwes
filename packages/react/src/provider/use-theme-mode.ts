import { ThemeMode } from "@marwes-ui/core"
import type { ThemePreference } from "@marwes-ui/core"
import * as React from "react"
import { MarwesContext } from "./marwes-context"

export type ThemeModeContextValue = {
  mode: ThemeMode
  preference: ThemePreference
  systemMode: ThemeMode
  setMode: (mode: ThemeMode) => void
  setPreference: (preference: ThemePreference) => void
  toggleMode: () => void
  isDark: boolean
  isLight: boolean
  isSystem: boolean
}

export function useThemeMode(): ThemeModeContextValue {
  const ctx = React.useContext(MarwesContext)

  if (!ctx) {
    throw new Error("MarwesProvider is missing. Wrap your app in <MarwesProvider />.")
  }

  return {
    mode: ctx.mode,
    preference: ctx.preference,
    systemMode: ctx.systemMode,
    setMode: ctx.setMode,
    setPreference: ctx.setPreference,
    toggleMode: ctx.toggleMode,
    isDark: ctx.mode === ThemeMode.dark,
    isLight: ctx.mode === ThemeMode.light,
    isSystem: ctx.preference === "system",
  }
}
