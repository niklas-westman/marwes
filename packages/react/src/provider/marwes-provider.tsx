import type { ResolvedTheme, ThemeInput, ThemeMode } from "@marwes-ui/core"
import { resolveThemeInput } from "@marwes-ui/core"
import * as React from "react"
import { MarwesContext } from "./marwes-context"
import { applyThemeToElement, loadThemeFonts } from "./runtime-theme"

export type MarwesProviderProps = {
  theme?: ThemeInput
  onModeChange?: (mode: ThemeMode) => void
  children: React.ReactNode
}

export function MarwesProvider({ theme, onModeChange, children }: MarwesProviderProps) {
  const rootRef = React.useRef<HTMLDivElement>(null)

  const resolved: ResolvedTheme = React.useMemo(() => resolveThemeInput(theme ?? {}), [theme])

  React.useEffect(() => {
    if (rootRef.current) {
      applyThemeToElement(rootRef.current, resolved)
    }
  }, [resolved])

  React.useEffect(() => {
    loadThemeFonts(resolved)
  }, [resolved])

  return (
    <MarwesContext.Provider value={{ theme: resolved, onModeChange }}>
      <div ref={rootRef} className={`mw-theme--${theme?.mode ?? "light"}`}>
        {children}
      </div>
    </MarwesContext.Provider>
  )
}
