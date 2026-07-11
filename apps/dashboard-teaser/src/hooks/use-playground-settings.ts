import { ThemeMode } from "@marwes-ui/react"
import type { Dispatch, SetStateAction } from "react"
import { useCallback, useMemo, useState } from "react"

import { type PlaygroundSettings, defaultPlaygroundSettings } from "../sections/playground-settings"
import {
  type ThemePreset,
  applyThemePreset,
  getActivePresetId,
  themePresets,
} from "../sections/theme-presets"

type UsePlaygroundSettingsResult = {
  settings: PlaygroundSettings
  setSettings: Dispatch<SetStateAction<PlaygroundSettings>>
  activePreset: ThemePreset
  toggleTheme: () => void
  openCustomBuilder: () => void
}

/**
 * Owns the dashboard's live theme state and the derived preset metadata every
 * consumer needs. Keeping this in one hook removes prop-drilling of both the
 * setter and the derived preset through the page tree.
 */
function usePlaygroundSettings(): UsePlaygroundSettingsResult {
  const [settings, setSettings] = useState(defaultPlaygroundSettings)

  const toggleTheme = useCallback((): void => {
    setSettings((current) => ({
      ...current,
      mode: current.mode === ThemeMode.light ? ThemeMode.dark : ThemeMode.light,
    }))
  }, [])

  const activePreset = useMemo<ThemePreset>(() => {
    const activeId = getActivePresetId(settings) ?? "marwes"
    return themePresets.find((preset) => preset.id === activeId) ?? themePresets[0]
  }, [settings])

  const openCustomBuilder = useCallback((): void => {
    const customPreset = themePresets.find((preset) => preset.id === "custom")
    if (customPreset) {
      setSettings((prev) => applyThemePreset(prev, customPreset))
    }
    document.getElementById("components")?.scrollIntoView({ behavior: "smooth" })
  }, [])

  return { settings, setSettings, activePreset, toggleTheme, openCustomBuilder }
}

export { usePlaygroundSettings }
export type { UsePlaygroundSettingsResult }
