import { SelectField, SwitchField, Text, TextVariant } from "@marwes-ui/react"
import type { Dispatch, SetStateAction } from "react"
import styled from "styled-components"

import { colorVisionOptionsDetailed } from "../constants/control-options"
import type {
  PlaygroundAccessibilitySettings,
  PlaygroundColorVision,
  PlaygroundSettings,
} from "../sections/playground-settings"

const AccessibilitySection = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sp8};
`

const SectionHeadings = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sp4};
`

const SectionSubhead = styled(Text).attrs({ variant: TextVariant.caption })`
  color: ${({ theme }) => theme.color.textMuted};
`

const AccessibilityCard = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.sp24};
  padding: ${({ theme }) => theme.spacing.sp24};
  border-radius: ${({ theme }) => theme.spacing.sp24};
  background: ${({ theme }) => theme.color.surface};

  ${({ theme }) => theme.media.mobileAndBelow} {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.sp16};
    padding: ${({ theme }) => theme.spacing.sp16};
  }
`

const ToggleColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sp12};
`

const ColorVisionColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sp8};
  border-left: 1px solid ${({ theme }) => theme.color.borderLow};
  padding-left: ${({ theme }) => theme.spacing.sp24};

  ${({ theme }) => theme.media.mobileAndBelow} {
    border-left: none;
    border-top: 1px solid ${({ theme }) => theme.color.borderLow};
    padding-left: 0;
    padding-top: ${({ theme }) => theme.spacing.sp16};
  }
`

const HelperText = styled(Text).attrs({ variant: TextVariant.caption })`
  color: ${({ theme }) => theme.color.textMuted};
`

type AccessibilityPanelProps = {
  settings: PlaygroundSettings
  onSettingsChange: Dispatch<SetStateAction<PlaygroundSettings>>
}

function AccessibilityPanel({ settings, onSettingsChange }: AccessibilityPanelProps): JSX.Element {
  const updateAccessibility = <K extends keyof PlaygroundAccessibilitySettings>(
    key: K,
    value: PlaygroundAccessibilitySettings[K],
  ): void => {
    onSettingsChange((current) => ({
      ...current,
      accessibility: { ...current.accessibility, [key]: value },
    }))
  }

  return (
    <AccessibilitySection data-dashboard-section="accessibility">
      <SectionHeadings>
        <Text variant={TextVariant.overline}>Choose accessibility options</Text>
        <SectionSubhead>
          These sit on top of any theme and apply the same way everywhere.
        </SectionSubhead>
      </SectionHeadings>
      <AccessibilityCard>
        <ToggleColumn>
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
          <SwitchField
            label="Dyslexic-friendly font"
            switch={{
              checked: settings.accessibility.dyslexicFont,
              onCheckedChange: (value) => updateAccessibility("dyslexicFont", value),
            }}
          />
          <SwitchField
            label="Loose letter spacing"
            switch={{
              checked: settings.accessibility.looseSpacing,
              onCheckedChange: (value) => updateAccessibility("looseSpacing", value),
            }}
          />
        </ToggleColumn>
        <ColorVisionColumn>
          <SelectField
            label="Colour vision"
            select={{
              options: colorVisionOptionsDetailed,
              value: settings.accessibility.colorVision,
              onValueChange: (value) =>
                updateAccessibility("colorVision", value as PlaygroundColorVision),
            }}
          />
          <HelperText>
            Status colors (success / warning / danger) stay at their normal values.
          </HelperText>
        </ColorVisionColumn>
      </AccessibilityCard>
    </AccessibilitySection>
  )
}

export { AccessibilityPanel }
export type { AccessibilityPanelProps }
