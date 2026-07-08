import type {
  FontLoadingConfig,
  MwTheme,
  ResolvedTheme,
  ThemeInput,
  ThemeMode,
  ThemePreference,
  ThemeVariableStrategy,
} from "@marwes-ui/core"
import {
  ThemeMode as MwThemeMode,
  createMwTheme,
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

export type MarwesProviderChildren = React.ReactNode | ((mwTheme: MwTheme) => React.ReactNode)

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
  variableStrategy?: ThemeVariableStrategy
  children: MarwesProviderChildren
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
  variableStrategy = "inline",
  children,
}: MarwesProviderProps) {
  const [providerElement, setProviderElement] = React.useState<HTMLDivElement | null>(null)
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
  const mwTheme = React.useMemo(() => createMwTheme(resolved), [resolved])
  const renderedChildren = typeof children === "function" ? children(mwTheme) : children
  const rootStyle = React.useMemo(() => {
    if (variableStrategy === "style-tag") return undefined
    return themeToRootStyle(resolved) as React.CSSProperties
  }, [resolved, variableStrategy])

  React.useEffect(() => {
    if (variableStrategy === "style-tag") return
    if (providerElement) {
      applyThemeToElement(providerElement, resolved)
    }
  }, [providerElement, resolved, variableStrategy])

  React.useEffect(() => {
    if (target === "provider") return

    const apply = () => {
      applyModeAttribute({
        target,
        providerElement: null,
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
      providerElement,
    }),
    [
      activeMode,
      activePreference,
      providerElement,
      resolved,
      setMode,
      setPreference,
      systemMode,
      toggleMode,
    ],
  )

  return (
    <MarwesContext.Provider value={contextValue}>
      <div
        ref={setProviderElement}
        className={`mw-theme--${resolved.mode}`}
        data-marwes-theme="true"
        data-marwes-mode={resolved.mode}
        data-marwes-personality={resolved.personality}
        style={rootStyle}
      >
        {renderedChildren}
      </div>
    </MarwesContext.Provider>
  )
}
