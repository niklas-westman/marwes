import type { FontLoadingConfig, ResolvedTheme, ThemeInput, ThemeMode } from "@marwes-ui/core"
import { resolveThemeInput } from "@marwes-ui/core"
import * as React from "react"
import { MarwesContext } from "./marwes-context"
import { applyThemeToElement, loadThemeFonts, themeToRootStyle } from "./runtime-theme"

export type MarwesProviderProps = {
  theme?: ThemeInput
  fontLoading?: FontLoadingConfig
  onModeChange?: (mode: ThemeMode) => void
  children: React.ReactNode
}

export function MarwesProvider({
  theme,
  fontLoading = "auto",
  onModeChange,
  children,
}: MarwesProviderProps) {
  const rootRef = React.useRef<HTMLDivElement>(null)

  const resolved: ResolvedTheme = React.useMemo(() => resolveThemeInput(theme ?? {}), [theme])
  const rootStyle = React.useMemo(
    () => themeToRootStyle(resolved) as React.CSSProperties,
    [resolved],
  )

  React.useEffect(() => {
    if (rootRef.current) {
      applyThemeToElement(rootRef.current, resolved)
    }
  }, [resolved])

  React.useEffect(() => {
    loadThemeFonts(resolved, fontLoading)
  }, [resolved, fontLoading])

  return (
    <MarwesContext.Provider value={{ theme: resolved, onModeChange }}>
      <div
        ref={rootRef}
        className={`mw-theme--${resolved.mode}`}
        data-marwes-theme="true"
        style={rootStyle}
      >
        {children}
      </div>
    </MarwesContext.Provider>
  )
}
