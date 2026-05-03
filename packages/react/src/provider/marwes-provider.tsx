import type { FontLoadingConfig, ResolvedTheme, ThemeInput, ThemeMode } from "@marwes-ui/core"
import { ThemeMode as MwThemeMode, resolveThemeInput } from "@marwes-ui/core"
import * as React from "react"
import { MarwesContext } from "./marwes-context"
import { applyThemeToElement, loadThemeFonts, themeToRootStyle } from "./runtime-theme"

export type MarwesProviderProps = {
  theme?: ThemeInput
  defaultMode?: ThemeMode
  mode?: ThemeMode
  fontLoading?: FontLoadingConfig
  onModeChange?: (mode: ThemeMode) => void
  children: React.ReactNode
}

export function MarwesProvider({
  theme,
  defaultMode = MwThemeMode.light,
  mode: controlledMode,
  fontLoading = "auto",
  onModeChange,
  children,
}: MarwesProviderProps) {
  const rootRef = React.useRef<HTMLDivElement>(null)
  const [internalMode, setInternalMode] = React.useState<ThemeMode>(defaultMode)
  const activeMode = controlledMode ?? theme?.mode ?? internalMode
  const isModeControlled = controlledMode !== undefined || theme?.mode !== undefined

  const setMode = React.useCallback(
    (nextMode: ThemeMode) => {
      if (!isModeControlled) {
        setInternalMode(nextMode)
      }

      onModeChange?.(nextMode)
    },
    [isModeControlled, onModeChange],
  )

  const toggleMode = React.useCallback(() => {
    setMode(activeMode === MwThemeMode.dark ? MwThemeMode.light : MwThemeMode.dark)
  }, [activeMode, setMode])

  const resolved: ResolvedTheme = React.useMemo(
    () => resolveThemeInput({ ...(theme ?? {}), mode: activeMode }),
    [activeMode, theme],
  )
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
    <MarwesContext.Provider value={{ theme: resolved, mode: activeMode, setMode, toggleMode }}>
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
