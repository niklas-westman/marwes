import { SegmentedControl, Text, TextVariant } from "@marwes-ui/react"
import type { Density, SegmentedControlItem } from "@marwes-ui/react"
import { type Dispatch, type SetStateAction, useId } from "react"
import styled from "styled-components"
// Atom is no longer publicly exported; deep-import for ToggleControlRow's custom layout.
import { Switch } from "../../../../packages/react/src/components/switch/switch"

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

const SectionLabel = styled(Text).attrs({ variant: TextVariant.overline })`
  color: ${({ theme }) => theme.color.textMuted};
`

const FieldRow = styled.label`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: ${({ theme }) => theme.spacing.sp12};
  align-items: center;
  min-width: 0;
  color: ${({ theme }) => theme.color.textMuted};
  font: inherit;
`

const FieldLabel = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const SelectControl = styled.select`
  width: 8.5rem;
  min-width: 0;
  border: 0.0625rem solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => `calc(${theme.ui.radius} * 1.5)`};
  background: ${({ theme }) => theme.color.background};
  color: ${({ theme }) => theme.color.text};
  padding: ${({ theme }) => `${theme.spacing.sp4} ${theme.spacing.sp8}`};
  font: inherit;
`

const ColorInput = styled.input`
  width: 3rem;
  height: 1.75rem;
  border: 0.0625rem solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => `calc(${theme.ui.radius} * 1.5)`};
  background: transparent;
  padding: ${({ theme }) => theme.spacing.sp2};
  cursor: pointer;

  &::-webkit-color-swatch-wrapper {
    padding: 0;
  }

  &::-webkit-color-swatch {
    border: none;
    border-radius: ${({ theme }) => theme.spacing.sp2};
  }
`

const RangeRow = styled.div`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: ${({ theme }) => theme.spacing.sp12};
  align-items: center;
  color: ${({ theme }) => theme.color.textMuted};
`

const RangeInput = styled.input`
  width: 100%;
  accent-color: ${({ theme }) => theme.color.primary.base};
`

const ToggleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sp12};
  color: ${({ theme }) => theme.color.textMuted};

  .mw-switch {
    flex-shrink: 0;
  }
`

const styleItems: SegmentedControlItem[] = [
  { value: "marwes", label: "Marwes" },
  { value: "cyber", label: "Cyber" },
  { value: "mono", label: "Mono" },
]

type ToggleControlRowProps = {
  label: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}

function ToggleControlRow({ label, checked, onCheckedChange }: ToggleControlRowProps): JSX.Element {
  const labelId = useId()

  return (
    <ToggleRow>
      <span id={labelId}>{label}</span>
      <Switch checked={checked} ariaLabelledBy={labelId} onCheckedChange={onCheckedChange} />
    </ToggleRow>
  )
}

function PlaygroundControls({ settings, onSettingsChange }: PlaygroundControlsProps): JSX.Element {
  const styleLabelId = useId()

  const updateColor = (key: keyof PlaygroundColorSettings, value: string): void => {
    onSettingsChange((current) => ({
      ...current,
      colors: { ...current.colors, [key]: value },
    }))
  }

  const updateAccessibility = (
    key: keyof PlaygroundAccessibilitySettings,
    value: PlaygroundAccessibilitySettings[typeof key],
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
        <SectionLabel id={styleLabelId}>Style</SectionLabel>
        <SegmentedControl
          items={styleItems}
          value={settings.style}
          onValueChange={(value) =>
            onSettingsChange((current) => applyPlaygroundStyle(current, value as PlaygroundStyle))
          }
          variant="inverse"
          size="sm"
          ariaLabelledBy={styleLabelId}
          style={{ width: "100%" }}
        />
      </ControlSection>

      <ControlSection>
        <SectionLabel>Typography</SectionLabel>
        <FieldRow>
          <FieldLabel>Font</FieldLabel>
          <SelectControl
            value={settings.font}
            onChange={(event) =>
              onSettingsChange((current) => ({
                ...current,
                font: event.target.value as PlaygroundFont,
              }))
            }
          >
            <option value="default">Theme default</option>
            <option value="instrument">Instrument Sans</option>
            <option value="mono">Fira Code</option>
            <option value="nunito">Nunito</option>
            <option value="editorial">Playfair Display</option>
          </SelectControl>
        </FieldRow>
      </ControlSection>

      <ControlSection>
        <SectionLabel>Colours</SectionLabel>
        <FieldRow>
          <FieldLabel>Primary</FieldLabel>
          <ColorInput
            type="color"
            value={settings.colors.primary}
            onChange={(event) => updateColor("primary", event.target.value)}
          />
        </FieldRow>
        <FieldRow>
          <FieldLabel>Danger</FieldLabel>
          <ColorInput
            type="color"
            value={settings.colors.danger}
            onChange={(event) => updateColor("danger", event.target.value)}
          />
        </FieldRow>
        <FieldRow>
          <FieldLabel>Success</FieldLabel>
          <ColorInput
            type="color"
            value={settings.colors.success}
            onChange={(event) => updateColor("success", event.target.value)}
          />
        </FieldRow>
        <FieldRow>
          <FieldLabel>Warning</FieldLabel>
          <ColorInput
            type="color"
            value={settings.colors.warning}
            onChange={(event) => updateColor("warning", event.target.value)}
          />
        </FieldRow>
      </ControlSection>

      <ControlSection>
        <SectionLabel>Accessibility</SectionLabel>
        <ToggleControlRow
          label="High contrast"
          checked={settings.accessibility.highContrast}
          onCheckedChange={(checked) => updateAccessibility("highContrast", checked)}
        />
        <ToggleControlRow
          label="Reduce motion"
          checked={settings.accessibility.reduceMotion}
          onCheckedChange={(checked) => updateAccessibility("reduceMotion", checked)}
        />
        <ToggleControlRow
          label="Dyslexic font"
          checked={settings.accessibility.dyslexicFont}
          onCheckedChange={(checked) => updateAccessibility("dyslexicFont", checked)}
        />
        <ToggleControlRow
          label="Loose spacing"
          checked={settings.accessibility.looseSpacing}
          onCheckedChange={(checked) => updateAccessibility("looseSpacing", checked)}
        />
        <FieldRow>
          <FieldLabel>Color vision</FieldLabel>
          <SelectControl
            value={settings.accessibility.colorVision}
            onChange={(event) =>
              updateAccessibility("colorVision", event.target.value as PlaygroundColorVision)
            }
          >
            <option value="normal">Normal</option>
            <option value="protanopia">Protanopia</option>
            <option value="deuteranopia">Deuteranopia</option>
            <option value="tritanopia">Tritanopia</option>
          </SelectControl>
        </FieldRow>
      </ControlSection>

      <ControlSection>
        <SectionLabel>Radius (px)</SectionLabel>
        <RangeRow>
          <span>0</span>
          <RangeInput
            type="range"
            aria-label="Radius"
            min={0}
            max={48}
            value={settings.radius}
            onChange={(event) =>
              onSettingsChange((current) => ({
                ...current,
                radius: Number(event.target.value),
              }))
            }
          />
          <span>48</span>
        </RangeRow>
      </ControlSection>

      <ControlSection>
        <SectionLabel>Component props</SectionLabel>
        <FieldRow>
          <FieldLabel>Density</FieldLabel>
          <SelectControl
            value={settings.density}
            onChange={(event) =>
              onSettingsChange((current) => ({
                ...current,
                density: event.target.value as Density,
              }))
            }
          >
            <option value="compact">Compact</option>
            <option value="comfortable">Comfortable</option>
            <option value="spacious">Spacious</option>
          </SelectControl>
        </FieldRow>
        <ToggleControlRow
          label="Show labels"
          checked={settings.componentOptions.showLabels}
          onCheckedChange={(checked) => updateOption("showLabels", checked)}
        />
        <ToggleControlRow
          label="Show descriptions"
          checked={settings.componentOptions.showDescriptions}
          onCheckedChange={(checked) => updateOption("showDescriptions", checked)}
        />
        <ToggleControlRow
          label="Show icons"
          checked={settings.componentOptions.showIcons}
          onCheckedChange={(checked) => updateOption("showIcons", checked)}
        />
        <ToggleControlRow
          label="Show helper text"
          checked={settings.componentOptions.showHelperText}
          onCheckedChange={(checked) => updateOption("showHelperText", checked)}
        />
      </ControlSection>
    </ControlsPanel>
  )
}

export { PlaygroundControls }
export type { PlaygroundControlsProps }
