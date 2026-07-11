import {
  SegmentedControlField,
  SelectField,
  SliderField,
  SwitchField,
  Text,
  TextVariant,
} from "@marwes-ui/react"
import type { Density } from "@marwes-ui/react"
import type { Dispatch, SetStateAction } from "react"
import styled from "styled-components"

import { ColorPickerField } from "../components/ColorPickerField"
import {
  colorVisionOptions,
  densityOptions,
  fontOptions,
  fontStyleItems,
  letterSpacingItems,
  styleItems,
} from "../constants/control-options"
import {
  type ComponentDisplayOptions,
  type PlaygroundAccessibilitySettings,
  type PlaygroundColorSettings,
  type PlaygroundColorVision,
  type PlaygroundFont,
  type PlaygroundSettings,
  type PlaygroundStyle,
  applyPlaygroundStyle,
} from "./playground-settings"

type PlaygroundControlsProps = {
  settings: PlaygroundSettings
  onSettingsChange: Dispatch<SetStateAction<PlaygroundSettings>>
}

const ControlsPanel = styled.aside`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sp24};
  width: 100%;
  min-width: 0;
  color: ${({ theme }) => theme.color.text};
`

const ControlSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => `calc(${theme.spacing.sp8} + ${theme.spacing.sp4})`};
`

const SectionHeader = styled(Text).attrs({ variant: TextVariant.overline })`
  color: ${({ theme }) => theme.color.textMuted};
`

// Visually hides the *Field molecule's internal label slot. The SectionHeader
// above the field already carries the visible label; the field still wires
// aria-labelledby via the hidden label so screen readers get it.
const HiddenFieldLabel = styled.div`
  .mw-segmented-control-field__label,
  .mw-switch-field__label,
  .mw-slider-field__header,
  .mw-input-field__label {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
`

function PlaygroundControls({ settings, onSettingsChange }: PlaygroundControlsProps): JSX.Element {
  const updateColor = (key: keyof PlaygroundColorSettings, value: string): void => {
    onSettingsChange((current) => ({
      ...current,
      colors: { ...current.colors, [key]: value },
    }))
  }

  const updateAccessibility = <K extends keyof PlaygroundAccessibilitySettings>(
    key: K,
    value: PlaygroundAccessibilitySettings[K],
  ): void => {
    onSettingsChange((current) => ({
      ...current,
      accessibility: { ...current.accessibility, [key]: value },
    }))
  }

  const updateOption = (key: keyof ComponentDisplayOptions, value: boolean): void => {
    onSettingsChange((current) => ({
      ...current,
      componentOptions: { ...current.componentOptions, [key]: value },
    }))
  }

  return (
    <ControlsPanel aria-label="Playground controls">
      <ControlSection>
        <SectionHeader>Style</SectionHeader>
        <HiddenFieldLabel>
          <SegmentedControlField<PlaygroundStyle>
            label="Style"
            segmentedControl={{
              items: styleItems,
              value: settings.style,
              onValueChange: (value) =>
                onSettingsChange((current) => applyPlaygroundStyle(current, value)),
              variant: "inverse",
              size: "sm",
              fullWidth: true,
            }}
          />
        </HiddenFieldLabel>
      </ControlSection>

      <ControlSection>
        <SectionHeader>Typography</SectionHeader>
        <SelectField
          label="Font"
          select={{
            options: fontOptions,
            value: settings.font,
            onValueChange: (value) =>
              onSettingsChange((current) => ({ ...current, font: value as PlaygroundFont })),
          }}
        />
      </ControlSection>

      <ControlSection>
        <SectionHeader>Colors</SectionHeader>
        <ColorPickerField
          label="Primary"
          value={settings.colors.primary}
          onValueChange={(value) => updateColor("primary", value)}
        />
        <ColorPickerField
          label="Danger"
          value={settings.colors.danger}
          onValueChange={(value) => updateColor("danger", value)}
        />
        <ColorPickerField
          label="Success"
          value={settings.colors.success}
          onValueChange={(value) => updateColor("success", value)}
        />
        <ColorPickerField
          label="Warning"
          value={settings.colors.warning}
          onValueChange={(value) => updateColor("warning", value)}
        />
      </ControlSection>

      <ControlSection>
        <SectionHeader>Radius (px)</SectionHeader>
        <HiddenFieldLabel>
          <SliderField
            label="Radius"
            showEdgeValues
            slider={{
              min: 0,
              max: 48,
              value: settings.radius,
              onValueChange: (value) =>
                onSettingsChange((current) => ({ ...current, radius: value })),
            }}
          />
        </HiddenFieldLabel>
      </ControlSection>

      <ControlSection>
        <SectionHeader>Component props</SectionHeader>
        <SelectField
          label="Density"
          select={{
            options: densityOptions,
            value: settings.density,
            onValueChange: (value) =>
              onSettingsChange((current) => ({ ...current, density: value as Density })),
          }}
        />
        <SwitchField
          label="Show labels"
          switch={{
            checked: settings.componentOptions.showLabels,
            onCheckedChange: (value) => updateOption("showLabels", value),
          }}
        />
        <SwitchField
          label="Show descriptions"
          switch={{
            checked: settings.componentOptions.showDescriptions,
            onCheckedChange: (value) => updateOption("showDescriptions", value),
          }}
        />
        <SwitchField
          label="Show icons"
          switch={{
            checked: settings.componentOptions.showIcons,
            onCheckedChange: (value) => updateOption("showIcons", value),
          }}
        />
        <SwitchField
          label="Show helper text"
          switch={{
            checked: settings.componentOptions.showHelperText,
            onCheckedChange: (value) => updateOption("showHelperText", value),
          }}
        />
      </ControlSection>

      <ControlSection>
        <SectionHeader>A11y</SectionHeader>
        <SwitchField
          label="High contrast"
          switch={{
            checked: settings.accessibility.highContrast,
            onCheckedChange: (value) => updateAccessibility("highContrast", value),
          }}
        />
        <SwitchField
          label="Reduce motion"
          switch={{
            checked: settings.accessibility.reduceMotion,
            onCheckedChange: (value) => updateAccessibility("reduceMotion", value),
          }}
        />
      </ControlSection>

      <ControlSection>
        <SectionHeader>Font style</SectionHeader>
        <HiddenFieldLabel>
          <SegmentedControlField<"default" | "dyslexic">
            label="Font style"
            segmentedControl={{
              items: fontStyleItems,
              value: settings.accessibility.dyslexicFont ? "dyslexic" : "default",
              onValueChange: (value) => updateAccessibility("dyslexicFont", value === "dyslexic"),
              fullWidth: true,
            }}
          />
        </HiddenFieldLabel>
      </ControlSection>

      <ControlSection>
        <SectionHeader>Letter spacing</SectionHeader>
        <HiddenFieldLabel>
          <SegmentedControlField<"default" | "loose">
            label="Letter spacing"
            segmentedControl={{
              items: letterSpacingItems,
              value: settings.accessibility.looseSpacing ? "loose" : "default",
              onValueChange: (value) => updateAccessibility("looseSpacing", value === "loose"),
              fullWidth: true,
            }}
          />
        </HiddenFieldLabel>
      </ControlSection>

      <ControlSection>
        <SectionHeader>Colour-blindness</SectionHeader>
        <HiddenFieldLabel>
          <SelectField
            label="Colour-blindness"
            select={{
              options: colorVisionOptions,
              value: settings.accessibility.colorVision,
              onValueChange: (value) =>
                updateAccessibility("colorVision", value as PlaygroundColorVision),
            }}
          />
        </HiddenFieldLabel>
      </ControlSection>
    </ControlsPanel>
  )
}

export { PlaygroundControls }
export type { PlaygroundControlsProps }
