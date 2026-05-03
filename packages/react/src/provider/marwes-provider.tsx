import type {
  FontLoadingConfig,
  ResolvedTheme,
  ThemeInput,
  ThemeMode,
  ThemePreference,
} from "@marwes-ui/core"
import {
  ThemeMode as MwThemeMode,
  nextThemeMode,
  resolveThemeInput,
  resolveThemePreference,
} from "@marwes-ui/core"
import * as React from "react"
import { MarwesContext } from "./marwes-context"
import { applyThemeToElement, loadThemeFonts, themeToRootStyle } from "./runtime-theme"
import {
  applyModeAttribute,
  getSystemThemeMode,
  readStoredThemePreference,
  subscribeToSystemThemeMode,
  withoutModeTransitions,
  writeStoredThemePreference,
} from "./theme-mode-runtime"
import type { ThemeAttribute, ThemeTarget } from "./theme-mode-runtime"

export type MarwesProviderProps = {
  theme?: ThemeInput
  defaultPreference?: ThemePreference
  preference?: ThemePreference
  defaultMode?: ThemeMode
  mode?: ThemeMode
  fontLoading?: FontLoadingConfig
  onPreferenceChange?: (preference: ThemePreference) => void
  onModeChange?: (mode: ThemeMode) => void
  storageKey?: string | false
  enableSystem?: boolean
  target?: ThemeTarget
  attribute?: ThemeAttribute
  disableTransitionOnChange?: boolean
  children: React.ReactNode
}

export function MarwesProvider({
  theme,
  defaultPreference,
  preference: controlledPreference,
  defaultMode,
  mode: controlledMode,
  fontLoading = "auto",
  onPreferenceChange,
  onModeChange,
  storageKey = false,
  enableSystem = true,
  target = "provider",
  attribute = "class",
  disableTransitionOnChange = false,
  children,
}: MarwesProviderProps) {
  const rootRef = React.useRef<HTMLDivElement>(null)
  const [internalPreference, setInternalPreference] = React.useState<ThemePreference>(
    defaultPreference ?? defaultMode ?? MwThemeMode.light,
  )
  const [systemMode, setSystemMode] = React.useState<ThemeMode>(() =>
    enableSystem ? getSystemThemeMode() : MwThemeMode.light,
  )

  const activePreference =
    controlledPreference ?? controlledMode ?? theme?.mode ?? internalPreference
  const activeMode = resolveThemePreference(activePreference, systemMode)
  const isPreferenceControlled =
    controlledPreference !== undefined || controlledMode !== undefined || theme?.mode !== undefined

  React.useEffect(() => {
    const storedPreference = readStoredThemePreference(storageKey)
    if (storedPreference !== undefined && !isPreferenceControlled) {
      setInternalPreference(storedPreference)
    }
  }, [isPreferenceControlled, storageKey])

  React.useEffect(() => {
    if (!enableSystem) {
      setSystemMode(MwThemeMode.light)
      return
    }

    setSystemMode(getSystemThemeMode())

    if (activePreference !== "system") {
      return
    }

    return subscribeToSystemThemeMode(setSystemMode)
  }, [activePreference, enableSystem])

  const setPreference = React.useCallback(
    (nextPreference: ThemePreference) => {
      if (!isPreferenceControlled) {
        setInternalPreference(nextPreference)
      }

      writeStoredThemePreference(storageKey, nextPreference)
      onPreferenceChange?.(nextPreference)
    },
    [isPreferenceControlled, onPreferenceChange, storageKey],
  )

  const setMode = React.useCallback(
    (nextMode: ThemeMode) => {
      setPreference(nextMode)
      onModeChange?.(nextMode)
    },
    [onModeChange, setPreference],
  )

  const toggleMode = React.useCallback(() => {
    setMode(nextThemeMode(activeMode))
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
    if (target === "provider") return

    const apply = () => {
      applyModeAttribute({
        target,
        providerElement: rootRef.current,
        mode: activeMode,
        attribute,
      })
    }

    if (disableTransitionOnChange) {
      withoutModeTransitions(apply)
      return
    }

    apply()
  }, [activeMode, attribute, disableTransitionOnChange, target])

  React.useEffect(() => {
    loadThemeFonts(resolved, fontLoading)
  }, [resolved, fontLoading])

  const contextValue = React.useMemo(
    () => ({
      theme: resolved,
      mode: activeMode,
      preference: activePreference,
      systemMode,
      setMode,
      setPreference,
      toggleMode,
    }),
    [activeMode, activePreference, resolved, setMode, setPreference, systemMode, toggleMode],
  )

  return (
    <MarwesContext.Provider value={contextValue}>
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
