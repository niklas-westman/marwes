import type { ThemeInput, ThemeMode, ThemePreference } from "@marwes-ui/core"
import {
  ThemeMode as MwThemeMode,
  nextThemeMode,
  resolveThemeInput,
  resolveThemePreference,
} from "@marwes-ui/core"
import { useCallback, useEffect, useMemo, useState } from "react"
import { Appearance } from "react-native"
import { MarwesNativeContext } from "./marwes-native-context"

export interface MarwesNativeProviderProps {
  theme?: ThemeInput
  defaultMode?: ThemeMode
  children: React.ReactNode
}

function getSystemMode(): ThemeMode {
  const scheme = Appearance.getColorScheme()
  return scheme === "dark" ? MwThemeMode.dark : MwThemeMode.light
}

export function MarwesNativeProvider({ theme, defaultMode, children }: MarwesNativeProviderProps) {
  const [preference, setPreference] = useState<ThemePreference>(defaultMode ?? "system")
  const [systemMode, setSystemMode] = useState<ThemeMode>(getSystemMode)

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemMode(colorScheme === "dark" ? MwThemeMode.dark : MwThemeMode.light)
    })
    return () => subscription.remove()
  }, [])

  const activeMode = resolveThemePreference(preference, systemMode)

  const resolved = useMemo(
    () => resolveThemeInput({ ...(theme ?? {}), mode: activeMode }),
    [activeMode, theme],
  )

  const setMode = useCallback((nextMode: ThemeMode) => {
    setPreference(nextMode)
  }, [])

  const toggleMode = useCallback(() => {
    setMode(nextThemeMode(activeMode))
  }, [activeMode, setMode])

  const contextValue = useMemo(
    () => ({
      theme: resolved,
      mode: activeMode,
      preference,
      setMode,
      setPreference,
      toggleMode,
    }),
    [activeMode, preference, resolved, setMode, toggleMode],
  )

  return (
    <MarwesNativeContext.Provider value={contextValue}>{children}</MarwesNativeContext.Provider>
  )
}
