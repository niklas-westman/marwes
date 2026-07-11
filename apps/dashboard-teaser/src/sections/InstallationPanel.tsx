import { Button, ButtonVariant, IconName, Text, TextVariant } from "@marwes-ui/react"
import { useState } from "react"
import styled from "styled-components"
// Atoms are no longer publicly exported; deep-import for the read-only command display.
import { Input } from "../../../../packages/react/src/components/input/input"
import { Textarea } from "../../../../packages/react/src/components/input/textarea"
import { SegmentedControl } from "../../../../packages/react/src/components/segmented-control/segmented-control"

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

const CommandInput = styled(Input)`
  flex: 1;
  width: 100%;
  min-width: 0;
  font-family: ${({ theme }) => theme.font.mono};
  cursor: text;
`

const PromptTextarea = styled(Textarea)`
  flex: 1;
  width: 100%;
  min-width: 0;
  min-height: ${({ theme }) => theme.spacing.sp80};
  cursor: text;
`

const CopyButton = styled(Button)<{ $offset?: boolean }>`
  && {
  width: ${({ theme }) => `calc(${theme.spacing.sp16} + ${theme.spacing.sp4})`};
  height: ${({ theme }) => `calc(${theme.spacing.sp16} + ${theme.spacing.sp4})`};
  flex-shrink: 0;
  padding: 0;
  margin-top: ${(p) => (p.$offset ? `calc(${p.theme.spacing.sp8} + ${p.theme.spacing.sp4})` : "0")};
  }
`

function InstallationPanel(): JSX.Element {
  const [activeTab, setActiveTab] = useState<Framework>("react")

  return (
    <PanelContainer>
      <InputSection>
        <PanelTitle>Installation</PanelTitle>
        <SegmentedControlScroll>
          <SegmentedControl
            items={frameworkItems}
            value={activeTab}
            onValueChange={setActiveTab}
            variant="inverse"
            size="md"
            ariaLabel="Framework"
            fullWidth
          />
        </SegmentedControlScroll>
      </InputSection>

      <InputSection>
        <InputLabel>Install</InputLabel>
        <FieldRow>
          <CommandInput
            value={createExistingAppInstallCommand(activeTab)}
            readOnly
            ariaLabel="Existing app install command"
          />
          <CopyButton
            variant={ButtonVariant.text}
            iconOnly
            iconRight={IconName.Copy}
            ariaLabel="Copy existing app install command"
          />
        </FieldRow>
      </InputSection>

      <InputSection>
        <InputLabel>Install with AI</InputLabel>
        <FieldRow $align="flex-start">
          <PromptTextarea
            value={createAgenticInstallPrompt(activeTab)}
            readOnly
            resize="none"
            rows={4}
            ariaLabel="AI install prompt"
          />
          <CopyButton
            variant={ButtonVariant.text}
            iconOnly
            iconRight={IconName.Copy}
            ariaLabel="Copy AI install prompt"
            $offset
          />
        </FieldRow>
      </InputSection>
    </PanelContainer>
  )
}

export { InstallationPanel }
