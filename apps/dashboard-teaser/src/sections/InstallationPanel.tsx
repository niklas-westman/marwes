import { SegmentedControl } from "@marwes-ui/react"
import type { SegmentedControlItem } from "@marwes-ui/react"
import { useState } from "react"
import styled from "styled-components"

const PanelContainer = styled.div`
  width: 400px;
  padding: 48px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  border-radius: 12px;
  border: 1px solid var(--mw-color-border, #e5e5e5);
  background: var(--mw-color-surface, #ffffff);

  @media (max-width: 1024px) {
    width: 100%;
  }

  @media (max-width: 768px) {
    padding: 24px;
  }
`

const PanelTitle = styled.h2`
  font-family: "Instrument Sans", sans-serif;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--mw-color-text, #141414);
`

const InputSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const InputLabel = styled.span`
  font-family: "Instrument Sans", sans-serif;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--mw-color-text, #141414);
`

const FieldRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

const TextField = styled.div`
  flex: 1;
  height: 40px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  border-radius: 8px;
  border: 1px solid var(--mw-color-border, #e5e5e5);
  font-family: "Instrument Sans", monospace;
  font-size: 13px;
  color: var(--mw-color-text, #141414);
`

const TextAreaField = styled.div`
  flex: 1;
  min-height: 104px;
  display: flex;
  align-items: flex-start;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid var(--mw-color-border, #e5e5e5);
  font-family: "Instrument Sans", sans-serif;
  font-size: 13px;
  line-height: 1.5;
  color: var(--mw-color-text, #141414);
  white-space: pre-wrap;
`

const CopyButton = styled.button`
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  border: none;
  background: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--mw-color-text-muted, #595959);
  padding: 0;
  transition: color 0.15s;

  &:hover {
    color: var(--mw-color-text, #141414);
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
        <SegmentedControl
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
        <FieldRow style={{ alignItems: "flex-start" }}>
          <TextAreaField>{AI_PROMPTS[activeTab]}</TextAreaField>
          <CopyButton type="button" title="Copy to clipboard" style={{ marginTop: 12 }}>
            <CopyIcon />
          </CopyButton>
        </FieldRow>
      </InputSection>
    </PanelContainer>
  )
}

export { InstallationPanel }
