import { ThemeMode } from "@marwes-ui/react"
import type { Dispatch, SetStateAction } from "react"
import { useCallback, useMemo, useRef, useState } from "react"

import { type PlaygroundSettings, defaultPlaygroundSettings } from "../sections/playground-settings"
import {
  type ThemePreset,
  type ThemePresetId,
  applyThemePreset,
  getActivePresetId,
  markCustom,
  themePresets,
} from "../sections/theme-presets"

type UsePlaygroundSettingsResult = {
  settings: PlaygroundSettings
  setSettings: Dispatch<SetStateAction<PlaygroundSettings>>
  activePreset: ThemePreset
  customBuilderOpen: boolean
  toggleTheme: () => void
  selectThemePreset: (id: ThemePresetId) => void
  setCustomBuilderOpen: (open: boolean) => void
  openCustomBuilder: () => void
}

type CustomPresetSnapshot = Pick<
  PlaygroundSettings,
  "style" | "font" | "radius" | "density" | "personality" | "colors" | "colorOverrides"
>

function captureCustomPresetSnapshot(settings: PlaygroundSettings): CustomPresetSnapshot {
  return {
    style: settings.style,
    font: settings.font,
    radius: settings.radius,
    density: settings.density,
    personality: settings.personality,
    colors: settings.colors,
    colorOverrides: settings.colorOverrides,
  }
}

/**
 * Owns the dashboard's live theme state and the derived preset metadata every
 * consumer needs. Keeping this in one hook removes prop-drilling of both the
 * setter and the derived preset through the page tree.
 */
function usePlaygroundSettings(): UsePlaygroundSettingsResult {
  const [settings, setSettings] = useState(defaultPlaygroundSettings)
  const [customBuilderOpen, setCustomBuilderOpenState] = useState(false)
  const customSnapshotRef = useRef<CustomPresetSnapshot | null>(null)

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

  const setCustomBuilderOpen = useCallback((open: boolean): void => {
    setCustomBuilderOpenState(open)
    requestAnimationFrame(() => {
      const focusTarget = open ? "dashboard-theme-builder" : "dashboard-theme-preset-custom"
      document.getElementById(focusTarget)?.focus()
    })
  }, [])

  const selectThemePreset = useCallback(
    (id: ThemePresetId): void => {
      const preset = themePresets.find((candidate) => candidate.id === id)
      if (!preset) return

      setSettings((current) => {
        const currentPresetId = getActivePresetId(current) ?? "marwes"
        if (currentPresetId === "custom" && id === "custom") {
          return current
        }

        if (currentPresetId === "custom" && id !== "custom") {
          customSnapshotRef.current = captureCustomPresetSnapshot(current)
        }

        if (id === "custom" && customSnapshotRef.current) {
          return markCustom({ ...current, ...customSnapshotRef.current })
        }

        return applyThemePreset(current, preset)
      })
      setCustomBuilderOpen(id === "custom")
    },
    [setCustomBuilderOpen],
  )

  const openCustomBuilder = useCallback((): void => {
    selectThemePreset("custom")
    requestAnimationFrame(() => {
      document.getElementById("theme-picker")?.scrollIntoView({ behavior: "smooth" })
    })
  }, [selectThemePreset])

  return {
    settings,
    setSettings,
    activePreset,
    customBuilderOpen,
    toggleTheme,
    selectThemePreset,
    setCustomBuilderOpen,
    openCustomBuilder,
  }
}

export { usePlaygroundSettings }
export type { UsePlaygroundSettingsResult }
