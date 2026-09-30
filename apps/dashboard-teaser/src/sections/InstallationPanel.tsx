import { SegmentedControlField, Text, TextVariant } from "@marwes-ui/react"
import styled from "styled-components"

import { ClipboardButton } from "../components/ClipboardButton"
import { SegmentedControlScroll } from "../components/SegmentedControlScroll"
import { cardShellStyles } from "../theme/theme-utils"
import { frameworkItems } from "./framework-tabs"
import {
  type Framework,
  createAgenticInstallPrompt,
  createExistingAppInstallCommand,
} from "./installation-recipes"

const PanelContainer = styled.div`
  width: 25rem;
  padding: ${({ theme }) => theme.spacing.sp32};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sp16};
  ${cardShellStyles}
  background: ${({ theme }) => theme.color.background};

  ${({ theme }) => theme.media.desktopAndBelow} {
    width: 100%;
  }

  ${({ theme }) => theme.media.mobileAndBelow} {
    padding: ${({ theme }) => theme.spacing.sp24};
  }
`

const PanelTitle = styled(Text).attrs({ variant: TextVariant.overline })`
  color: ${({ theme }) => theme.color.text};
`

const InputSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sp8};
`

const InputLabel = styled(Text).attrs({ variant: TextVariant.label })`
  color: ${({ theme }) => theme.color.text};
`

const FieldRow = styled.div<{ $align?: "center" | "flex-start" }>`
  display: flex;
  align-items: ${(p) => p.$align ?? "center"};
  gap: ${({ theme }) => `calc(${theme.spacing.sp8} + ${theme.spacing.sp4})`};
`

const CommandInput = styled.input`
  flex: 1;
  width: 100%;
  min-width: 0;
  min-height: 2.5rem;
  padding: 0 ${({ theme }) => theme.spacing.sp12};
  border: 0.0625rem solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.ui.radius};
  color: ${({ theme }) => theme.color.text};
  background: ${({ theme }) => theme.color.surface};
  font-family: ${({ theme }) => theme.font.mono};
  cursor: text;
`

const PromptTextarea = styled.textarea`
  flex: 1;
  width: 100%;
  min-width: 0;
  min-height: ${({ theme }) => theme.spacing.sp80};
  padding: ${({ theme }) => theme.spacing.sp12};
  border: 0.0625rem solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.ui.radius};
  color: ${({ theme }) => theme.color.text};
  background: ${({ theme }) => theme.color.surface};
  font: inherit;
  cursor: text;
`

const FrameworkField = styled.div`
  .mw-segmented-control-field__label {
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

interface InstallationPanelProps {
  activeTab: Framework
  onFrameworkChange: (framework: Framework) => void
}

function InstallationPanel({ activeTab, onFrameworkChange }: InstallationPanelProps): JSX.Element {
  return (
    <PanelContainer>
      <InputSection>
        <PanelTitle>Installation</PanelTitle>
        <SegmentedControlScroll>
          <FrameworkField>
            <SegmentedControlField
              label="Framework"
              segmentedControl={{
                items: frameworkItems,
                value: activeTab,
                onValueChange: onFrameworkChange,
                variant: "inverse",
                size: "md",
                fullWidth: true,
              }}
            />
          </FrameworkField>
        </SegmentedControlScroll>
      </InputSection>

      <InputSection>
        <InputLabel>Install</InputLabel>
        <FieldRow>
          <CommandInput
            value={createExistingAppInstallCommand(activeTab)}
            readOnly
            aria-label="Existing app install command"
          />
          <ClipboardButton
            value={createExistingAppInstallCommand(activeTab)}
            label="existing app install command"
          />
        </FieldRow>
      </InputSection>

      <InputSection>
        <InputLabel>Install with AI</InputLabel>
        <FieldRow $align="flex-start">
          <PromptTextarea
            value={createAgenticInstallPrompt(activeTab)}
            readOnly
            rows={4}
            aria-label="AI install prompt"
          />
          <ClipboardButton
            value={createAgenticInstallPrompt(activeTab)}
            label="AI install prompt"
          />
        </FieldRow>
      </InputSection>
    </PanelContainer>
  )
}

export { InstallationPanel }
