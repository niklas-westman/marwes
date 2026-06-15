import { SegmentedControl, Switch, Text, TextVariant } from "@marwes-ui/react"
import type { Density, SegmentedControlItem } from "@marwes-ui/react"
import type { Dispatch, SetStateAction } from "react"
import styled from "styled-components"

import {
  type ComponentDisplayOptions,
  type PlaygroundColorSettings,
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

function PlaygroundControls({ settings, onSettingsChange }: PlaygroundControlsProps): JSX.Element {
  const updateColor = (key: keyof PlaygroundColorSettings, value: string): void => {
    onSettingsChange((current) => ({
      ...current,
      colors: { ...current.colors, [key]: value },
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
        <SectionLabel>Style</SectionLabel>
        <SegmentedControl
          items={styleItems}
          value={settings.style}
          onValueChange={(value) =>
            onSettingsChange((current) => applyPlaygroundStyle(current, value as PlaygroundStyle))
          }
          variant="inverse"
          size="sm"
          ariaLabel="Style"
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
        <SectionLabel>Radius (px)</SectionLabel>
        <RangeRow>
          <span>0</span>
          <RangeInput
            type="range"
            min={0}
            max={48}
            value={settings.radius}
            onChange={(event) =>
              onSettingsChange((current) => ({ ...current, radius: Number(event.target.value) }))
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
        <ToggleRow>
          <span>Show labels</span>
          <Switch
            checked={settings.componentOptions.showLabels}
            ariaLabel="Show labels"
            onCheckedChange={(checked) => updateOption("showLabels", checked)}
          />
        </ToggleRow>
        <ToggleRow>
          <span>Show descriptions</span>
          <Switch
            checked={settings.componentOptions.showDescriptions}
            ariaLabel="Show descriptions"
            onCheckedChange={(checked) => updateOption("showDescriptions", checked)}
          />
        </ToggleRow>
        <ToggleRow>
          <span>Show icons</span>
          <Switch
            checked={settings.componentOptions.showIcons}
            ariaLabel="Show icons"
            onCheckedChange={(checked) => updateOption("showIcons", checked)}
          />
        </ToggleRow>
        <ToggleRow>
          <span>Show helper text</span>
          <Switch
            checked={settings.componentOptions.showHelperText}
            ariaLabel="Show helper text"
            onCheckedChange={(checked) => updateOption("showHelperText", checked)}
          />
        </ToggleRow>
      </ControlSection>
    </ControlsPanel>
  )
}

export { PlaygroundControls }
export type { PlaygroundControlsProps }
