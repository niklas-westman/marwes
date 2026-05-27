import {
  Button,
  ButtonVariant,
  IconName,
  Input,
  SegmentedControl,
  Text,
  TextVariant,
  Textarea,
} from "@marwes-ui/react"
import type { SegmentedControlItem } from "@marwes-ui/react"
import { useState } from "react"
import styled from "styled-components"

import { cardShellStyles } from "../styles/theme-utils"

const PanelContainer = styled.div`
  width: 25rem;
  padding: ${({ theme }) => theme.spacing.sp48};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sp24};
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

const FrameworkSelector = styled(SegmentedControl)`
  width: 100%;
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
  min-height: ${({ theme }) => `calc(${theme.spacing.sp80} + ${theme.spacing.sp24})`};
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

function ReactIcon(): JSX.Element {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="12" cy="12" r="2.5" />
      <ellipse cx="12" cy="12" rx="10" ry="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <ellipse
        cx="12"
        cy="12"
        rx="10"
        ry="4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        transform="rotate(60 12 12)"
      />
      <ellipse
        cx="12"
        cy="12"
        rx="10"
        ry="4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        transform="rotate(120 12 12)"
      />
    </svg>
  )
}

function VueIcon(): JSX.Element {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M2 3h4l6 10.5L18 3h4L12 22 2 3z" fill="currentColor" opacity="0.6" />
      <path d="M7 3h3.5L12 5.5 13.5 3H17l-5 8.5L7 3z" fill="currentColor" />
    </svg>
  )
}

function SvelteIcon(): JSX.Element {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path
        d="M19.1 2.4A7.4 7.4 0 0 0 9.6 3.6L5.3 6.8a5.8 5.8 0 0 0-2.5 3.9 6 6 0 0 0 .6 3.9 5.7 5.7 0 0 0-1 2.2 6.1 6.1 0 0 0 1 4.8 7.4 7.4 0 0 0 9.5 1.2l4.3-3.2a5.8 5.8 0 0 0 2.5-3.9 6 6 0 0 0-.6-3.9c.4-.7.7-1.4.9-2.2a6.1 6.1 0 0 0-1-4.8z"
        opacity="0.8"
      />
    </svg>
  )
}

type Framework = "react" | "vue" | "svelte"

const frameworkItems: SegmentedControlItem[] = [
  { value: "react", icon: <ReactIcon />, label: "React" },
  { value: "vue", icon: <VueIcon />, label: "Vue" },
  { value: "svelte", icon: <SvelteIcon />, label: "Svelte" },
]

const INSTALL_COMMANDS: Record<Framework, string> = {
  react: "pnpm add @marwes-ui/react",
  vue: "pnpm add @marwes-ui/vue",
  svelte: "pnpm add @marwes-ui/svelte",
}

const AI_PROMPTS: Record<Framework, string> = {
  react:
    "Install and set up @marwes-ui/react using pnpm.\nRun: pnpm add @marwes-ui/react. Import components from @marwes-ui/react and include the default stylesheet.",
  vue: "Install and set up @marwes-ui/vue using pnpm.\nRun: pnpm add @marwes-ui/vue. Import components from @marwes-ui/vue and include the default stylesheet.",
  svelte:
    "Install and set up @marwes-ui/svelte using pnpm.\nRun: pnpm add @marwes-ui/svelte. Import components from @marwes-ui/svelte and include the default stylesheet.",
}

function InstallationPanel(): JSX.Element {
  const [activeTab, setActiveTab] = useState<Framework>("react")

  return (
    <PanelContainer>
      <InputSection>
        <PanelTitle>Installation</PanelTitle>
        <FrameworkSelector
          items={frameworkItems}
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as Framework)}
          variant="inverse"
          size="md"
          ariaLabel="Framework"
        />
      </InputSection>

      <InputSection>
        <InputLabel>Manually install</InputLabel>
        <FieldRow>
          <CommandInput
            value={INSTALL_COMMANDS[activeTab]}
            readOnly
            ariaLabel="Manual install command"
          />
          <CopyButton
            variant={ButtonVariant.text}
            iconOnly
            iconRight={IconName.Copy}
            ariaLabel="Copy manual install command"
          />
        </FieldRow>
      </InputSection>

      <InputSection>
        <InputLabel>Install with AI</InputLabel>
        <FieldRow $align="flex-start">
          <PromptTextarea
            value={AI_PROMPTS[activeTab]}
            readOnly
            resize="none"
            rows={5}
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
