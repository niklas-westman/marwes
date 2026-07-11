import {
  Button,
  ButtonVariant,
  Drawer,
  SegmentedControlField,
  SelectField,
  SliderField,
  Spacer,
  Spacings,
  SwitchField,
  Text,
  TextVariant,
  type ThemeMode as ThemeModeValue,
} from "@marwes-ui/react"
import type { Density } from "@marwes-ui/react"
import type { Dispatch, SetStateAction } from "react"
import styled from "styled-components"

import { densityOptions, themeModeItems } from "../constants/control-options"
import type { PlaygroundSettings } from "../sections/playground-settings"
import type { ThemePreset, ThemePresetColorOverrides } from "../sections/theme-presets"
import { markCustom } from "../sections/theme-presets"
import { getNeutralSwatchDefaults, resolveSwatchColors } from "../utils/swatch-colors"
import { ColorPickerField } from "./ColorPickerField"
import { GoogleFontCombobox } from "./GoogleFontCombobox"

const DrawerBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sp24};
  min-width: 0;
`

const ControlSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sp12};
`

const SectionHeader = styled(Text).attrs({ variant: TextVariant.overline })`
  color: ${({ theme }) => theme.color.textMuted};
`

type CustomEditableColor = Extract<
  keyof ThemePresetColorOverrides,
  "primary" | "background" | "surface" | "text"
>

type CustomModeColorDefaults = Record<CustomEditableColor, string>

type ThemeBuilderDrawerProps = {
  settings: PlaygroundSettings
  onSettingsChange: Dispatch<SetStateAction<PlaygroundSettings>>
  customPreset: ThemePreset | undefined
  onClose: () => void
  onReset: () => void
}

function ThemeBuilderDrawer({
  settings,
  onSettingsChange,
  customPreset,
  onClose,
  onReset,
}: ThemeBuilderDrawerProps): JSX.Element {
  const getCustomModeDefaults = (mode: ThemeModeValue): CustomModeColorDefaults => {
    const [background, surface, primary, text] = resolveSwatchColors(
      customPreset?.colorOverrides,
      mode,
      customPreset?.primary ?? settings.colors.primary,
      getNeutralSwatchDefaults(mode),
    )
    return { background, surface, primary, text }
  }

  const currentModeDefaults = getCustomModeDefaults(settings.mode)

  const getCurrentModeColor = (key: CustomEditableColor): string => {
    if (key === "primary") {
      const primary = settings.colorOverrides?.[settings.mode]?.primary
      return typeof primary === "string" ? primary : currentModeDefaults.primary
    }

    if (key === "surface") {
      return (
        settings.colorOverrides?.[settings.mode]?.surfaceElevated ??
        settings.colorOverrides?.[settings.mode]?.surface ??
        currentModeDefaults.surface
      )
    }

    return settings.colorOverrides?.[settings.mode]?.[key] ?? currentModeDefaults[key]
  }

  const updateCurrentModeColor = (key: CustomEditableColor, value: string): void => {
    onSettingsChange((current) =>
      markCustom({
        ...current,
        colorOverrides: {
          ...current.colorOverrides,
          [current.mode]: {
            ...current.colorOverrides?.[current.mode],
            [key]: value,
            ...(key === "surface" ? { surfaceElevated: value } : {}),
          },
        },
      }),
    )
  }

  return (
    <Drawer
      id="dashboard-theme-builder"
      modal
      title="Theme builder"
      description="Build your own theme."
      size="medium"
      placement="right"
      onClose={onClose}
      footer={
        <>
          <Button variant={ButtonVariant.secondary} onClick={onReset}>
            Reset
          </Button>
          <Button variant={ButtonVariant.primary} onClick={onClose}>
            Confirm
          </Button>
        </>
      }
    >
      <DrawerBody>
        <ControlSection>
          <Spacer spacing={Spacings.sp4} />
          <SectionHeader>Colors</SectionHeader>
          <ColorPickerField
            label="Primary"
            value={getCurrentModeColor("primary")}
            onValueChange={(value) => updateCurrentModeColor("primary", value)}
            showHexValue
          />
          <ColorPickerField
            label="Background"
            value={getCurrentModeColor("background")}
            onValueChange={(value) => updateCurrentModeColor("background", value)}
            showHexValue
          />
          <ColorPickerField
            label="Surface"
            value={getCurrentModeColor("surface")}
            onValueChange={(value) => updateCurrentModeColor("surface", value)}
            showHexValue
          />
          <ColorPickerField
            label="Text"
            value={getCurrentModeColor("text")}
            onValueChange={(value) => updateCurrentModeColor("text", value)}
            showHexValue
          />
        </ControlSection>

        <ControlSection>
          <SectionHeader>Edit mode</SectionHeader>
          <SegmentedControlField<ThemeModeValue>
            label="Edit colors for"
            segmentedControl={{
              items: themeModeItems,
              value: settings.mode,
              onValueChange: (value) =>
                onSettingsChange((current) => markCustom({ ...current, mode: value })),
              variant: "inverse",
              size: "sm",
              fullWidth: true,
            }}
          />
        </ControlSection>

        <ControlSection>
          <SectionHeader>Typeface</SectionHeader>
          <GoogleFontCombobox
            value={settings.font}
            onSelect={(family) =>
              onSettingsChange((current) => markCustom({ ...current, font: family }))
            }
          />
        </ControlSection>

        <ControlSection>
          <SectionHeader>Corner radius</SectionHeader>
          <SliderField
            label={`Radius: ${settings.radius}px`}
            showEdgeValues
            slider={{
              min: 0,
              max: 48,
              value: settings.radius,
              onValueChange: (value) =>
                onSettingsChange((current) => markCustom({ ...current, radius: value })),
            }}
          />
        </ControlSection>

        <ControlSection>
          <SectionHeader>Component feel</SectionHeader>
          <SelectField
            label="Density"
            select={{
              options: densityOptions,
              value: settings.density,
              onValueChange: (value) =>
                onSettingsChange((current) =>
                  markCustom({ ...current, density: value as Density }),
                ),
            }}
          />
          <SwitchField
            label="Glow on interactive elements"
            switch={{
              checked: settings.personality === "glow",
              onCheckedChange: (value) =>
                onSettingsChange((current) =>
                  markCustom({
                    ...current,
                    personality: value ? "glow" : "outlined",
                  }),
                ),
            }}
          />
        </ControlSection>
      </DrawerBody>
    </Drawer>
  )
}

export { ThemeBuilderDrawer }
export type { ThemeBuilderDrawerProps }
