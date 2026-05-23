import { SegmentedControl } from "@marwes-ui/react"
import type { SegmentedControlItem } from "@marwes-ui/react"
import { useState } from "react"
import styled from "styled-components"

import { cardShellStyles, dashboardRadius, sectionLabelStyles } from "../styles/theme-utils"

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

const PanelTitle = styled.h2`
  ${sectionLabelStyles}
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

const InputLabel = styled.span`
  ${sectionLabelStyles}
  color: ${({ theme }) => theme.color.text};
`

const FieldRow = styled.div<{ $align?: "center" | "flex-start" }>`
  display: flex;
  align-items: ${(p) => p.$align ?? "center"};
  gap: ${({ theme }) => `calc(${theme.spacing.sp8} + ${theme.spacing.sp4})`};
`

const TextField = styled.div`
  flex: 1;
  height: ${({ theme }) => theme.spacing.sp40};
  display: flex;
  align-items: center;
  padding: 0 ${({ theme }) => `calc(${theme.spacing.sp8} + ${theme.spacing.sp4})`};
  border-radius: ${({ theme }) => dashboardRadius(theme, 2)};
  border: 0.0625rem solid ${({ theme }) => theme.color.border};
  font-family: ${({ theme }) => theme.font.mono};
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.color.text};
`

const TextAreaField = styled.div`
  flex: 1;
  min-height: ${({ theme }) => `calc(${theme.spacing.sp80} + ${theme.spacing.sp24})`};
  display: flex;
  align-items: flex-start;
  padding: ${({ theme }) => `calc(${theme.spacing.sp8} + ${theme.spacing.sp4})`};
  border-radius: ${({ theme }) => dashboardRadius(theme, 2)};
  border: 0.0625rem solid ${({ theme }) => theme.color.border};
  font-family: ${({ theme }) => theme.font.primary};
  font-size: 0.8125rem;
  line-height: ${({ theme }) => theme.typography.paragraph.sm.lineHeight};
  color: ${({ theme }) => theme.color.text};
  white-space: pre-wrap;
`

const CopyButton = styled.button<{ $offset?: boolean }>`
  width: ${({ theme }) => `calc(${theme.spacing.sp16} + ${theme.spacing.sp4})`};
  height: ${({ theme }) => `calc(${theme.spacing.sp16} + ${theme.spacing.sp4})`};
  flex-shrink: 0;
  border: none;
  background: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.color.textMuted};
  padding: 0;
  margin-top: ${(p) => (p.$offset ? `calc(${p.theme.spacing.sp8} + ${p.theme.spacing.sp4})` : "0")};
  transition: color 0.15s;

  &:hover {
    color: ${({ theme }) => theme.color.text};
  }
`

function CopyIcon(): JSX.Element {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}

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
          <TextField>{INSTALL_COMMANDS[activeTab]}</TextField>
          <CopyButton type="button" title="Copy to clipboard">
            <CopyIcon />
          </CopyButton>
        </FieldRow>
      </InputSection>

      <InputSection>
        <InputLabel>Install with AI</InputLabel>
        <FieldRow $align="flex-start">
          <TextAreaField>{AI_PROMPTS[activeTab]}</TextAreaField>
          <CopyButton type="button" title="Copy to clipboard" $offset>
            <CopyIcon />
          </CopyButton>
        </FieldRow>
      </InputSection>
    </PanelContainer>
  )
}

export { InstallationPanel }
