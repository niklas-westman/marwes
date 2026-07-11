import { Text, TextVariant, type ThemeMode as ThemeModeValue } from "@marwes-ui/react"
import type { Dispatch, SetStateAction } from "react"
import { useRef, useState } from "react"
import styled from "styled-components"

import type { PlaygroundSettings } from "../sections/playground-settings"
import { type ThemePresetId, applyThemePreset, themePresets } from "../sections/theme-presets"
import {
  getNeutralSwatchDefaults,
  getPresetSwatchColors,
  resolveSwatchColors,
} from "../utils/swatch-colors"
import { PresetCard } from "./PresetCard"
import { ThemeBuilderDrawer, markCustom } from "./ThemeBuilderDrawer"

const ThemePickerRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sp16};
`

const ThemePickerGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;

  ${({ theme }) => theme.media.desktopAndBelow} {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }

  ${({ theme }) => theme.media.mobileAndBelow} {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
`

type ThemePickerProps = {
  activePresetId: ThemePresetId
  currentMode: ThemeModeValue
  settings: PlaygroundSettings
  onSettingsChange: Dispatch<SetStateAction<PlaygroundSettings>>
  onSelect: (id: ThemePresetId) => void
}

/**
 * The subset of `PlaygroundSettings` that defines the *custom preset's
 * identity* — colors, radius, font, etc. `mode`, `accessibility`, and
 * `componentOptions` are intentionally excluded: those are global UI
 * togglers that must survive a round-trip through another preset, otherwise
 * re-entering custom would clobber the header light/dark choice.
 */
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

function ThemePicker({
  activePresetId,
  currentMode,
  settings,
  onSettingsChange,
  onSelect,
}: ThemePickerProps): JSX.Element {
  const [customDrawerOpen, setCustomDrawerOpen] = useState(false)
  const customSnapshotRef = useRef<CustomPresetSnapshot | null>(null)
  const customPreset = themePresets.find((preset) => preset.id === "custom")

  const handlePresetSelect = (id: ThemePresetId): void => {
    if (activePresetId === "custom" && id !== "custom") {
      customSnapshotRef.current = captureCustomPresetSnapshot(settings)
    }

    if (id === "custom" && customSnapshotRef.current) {
      const snapshot = customSnapshotRef.current
      onSettingsChange((current) => markCustom({ ...current, ...snapshot }))
      setCustomDrawerOpen(true)
      return
    }

    onSelect(id)
    setCustomDrawerOpen(id === "custom")
  }

  const resetCustom = (): void => {
    if (!customPreset) return
    onSettingsChange((current) => {
      const resetSettings = applyThemePreset(current, customPreset)
      customSnapshotRef.current = captureCustomPresetSnapshot(resetSettings)
      return resetSettings
    })
  }

  return (
    <ThemePickerRow data-dashboard-section="theme-picker">
      <Text variant={TextVariant.overline}>Choose a theme</Text>
      <ThemePickerGrid role="radiogroup" aria-label="Choose a theme">
        {themePresets.map((preset) => {
          const isActive = preset.id === activePresetId
          const swatchColors =
            preset.id === "custom" && isActive
              ? resolveSwatchColors(
                  settings.colorOverrides,
                  currentMode,
                  customPreset?.primary ?? settings.colors.primary,
                  getNeutralSwatchDefaults(currentMode),
                )
              : getPresetSwatchColors(preset, currentMode)

          return (
            <PresetCard
              key={preset.id}
              preset={preset}
              isActive={isActive}
              swatchColors={swatchColors}
              onSelect={() => handlePresetSelect(preset.id)}
              onCardClick={preset.id === "custom" ? () => setCustomDrawerOpen(true) : undefined}
            />
          )
        })}
      </ThemePickerGrid>

      {customDrawerOpen && (
        <ThemeBuilderDrawer
          settings={settings}
          onSettingsChange={onSettingsChange}
          customPreset={customPreset}
          onClose={() => setCustomDrawerOpen(false)}
          onReset={resetCustom}
        />
      )}
    </ThemePickerRow>
  )
}

export { ThemePicker }
export type { ThemePickerProps }
