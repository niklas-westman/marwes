import { Text, TextVariant, type ThemeMode as ThemeModeValue } from "@marwes-ui/react"
import { type Dispatch, type SetStateAction, Suspense, lazy } from "react"
import styled from "styled-components"

import type { PlaygroundSettings } from "../sections/playground-settings"
import { type ThemePresetId, applyThemePreset, themePresets } from "../sections/theme-presets"
import {
  getNeutralSwatchDefaults,
  getPresetSwatchColors,
  resolveSwatchColors,
} from "../utils/swatch-colors"
import { PresetCard } from "./PresetCard"

const ThemeBuilderDrawer = lazy(() =>
  import("./ThemeBuilderDrawer").then((m) => ({ default: m.ThemeBuilderDrawer })),
)

const ThemePickerRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sp16};
`

const ThemePickerGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: ${({ theme }) => theme.spacing.sp12};

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
  customBuilderOpen: boolean
  onCustomBuilderOpenChange: (open: boolean) => void
  onSelect: (id: ThemePresetId) => void
}

function ThemePicker({
  activePresetId,
  currentMode,
  settings,
  onSettingsChange,
  customBuilderOpen,
  onCustomBuilderOpenChange,
  onSelect,
}: ThemePickerProps): JSX.Element {
  const customPreset = themePresets.find((preset) => preset.id === "custom")

  const handlePresetSelect = (id: ThemePresetId): void => {
    onSelect(id)
  }

  const resetCustom = (): void => {
    if (!customPreset) return
    onSettingsChange((current) => {
      const resetSettings = applyThemePreset(current, customPreset)
      return resetSettings
    })
  }

  return (
    <ThemePickerRow id="theme-picker" data-dashboard-section="theme-picker">
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
              onCardClick={
                preset.id === "custom" && isActive
                  ? () => onCustomBuilderOpenChange(true)
                  : undefined
              }
            />
          )
        })}
      </ThemePickerGrid>

      {customBuilderOpen && (
        <Suspense fallback={null}>
          <ThemeBuilderDrawer
            settings={settings}
            onSettingsChange={onSettingsChange}
            customPreset={customPreset}
            onClose={() => onCustomBuilderOpenChange(false)}
            onReset={resetCustom}
          />
        </Suspense>
      )}
    </ThemePickerRow>
  )
}

export { ThemePicker }
export type { ThemePickerProps }
