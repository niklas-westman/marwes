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
  /**
   * DOM element that hosts the theme (CSS variables + mode class). Portalled
   * components — DialogModal, dropdowns, overlays — should default their
   * portal target to this element so they stay inside the theme scope.
   * `null` until the provider mounts.
   */
  providerElement: HTMLElement | null
}

export const MarwesContext = React.createContext<MarwesContextValue | null>(null)
