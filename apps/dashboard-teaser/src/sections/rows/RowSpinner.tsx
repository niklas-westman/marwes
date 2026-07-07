import { Button, ButtonVariant, Spinner, Text, TextVariant } from "@marwes-ui/react"
import { useState } from "react"
import styled from "styled-components"

import { CodeIconButton } from "../../components/CodeIconButton"
import { CodeSnippetModal } from "../../components/CodeSnippetModal"
import type { ComponentDisplayOptions } from "../playground-settings"
import { FlexAreaCard, ShowcaseFlexRow } from "./shared"
import { spinnerSnippets } from "./spinner-snippets"

const LeftCard = styled(FlexAreaCard)`
  @container (max-width: 54rem) {
    flex-basis: 100%;
  }
`

const RightCard = styled(FlexAreaCard)`
  @container (max-width: 54rem) {
    flex-basis: 100%;
  }
`

const SpinnerRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sp16};
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: center;
`

const SpinnerItem = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sp8};
  border: none;
  background: none;
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.sp4};
  border-radius: ${({ theme }) => `calc(${theme.ui.radius} * 1.5)`};
  transition: background 0.15s;

  &:hover {
    background: ${({ theme }) => theme.color.surfaceSubtle};
  }
`

const SpinnerLabel = styled(Text).attrs({ variant: TextVariant.caption })`
  color: ${({ theme }) => theme.color.textMuted};
`

const ButtonRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sp16};
`

const SpinnerButtonPreview = styled(Button)`
  cursor: default;
`

type SpinnerVariantKey =
  | "ring"
  | "classic"
  | "dual"
  | "dots-round"
  | "dots-square"
  | "lines"
  | "cross"

const VARIANTS: { key: SpinnerVariantKey; label: string }[] = [
  { key: "ring", label: "Ring" },
  { key: "classic", label: "Classic" },
  { key: "dual", label: "Dual" },
  { key: "dots-round", label: "Dots-Round" },
  { key: "dots-square", label: "Dots-Square" },
  { key: "lines", label: "Lines" },
  { key: "cross", label: "Cross" },
]

type RowSpinnerProps = {
  options: ComponentDisplayOptions
}

function RowSpinner({ options }: RowSpinnerProps): JSX.Element {
  const [activeVariant, setActiveVariant] = useState<SpinnerVariantKey>("ring")
  const [leftCodeOpen, setLeftCodeOpen] = useState(false)
  const [rightCodeOpen, setRightCodeOpen] = useState(false)

  return (
    <ShowcaseFlexRow>
      <LeftCard $basis="20.0625rem" $minHeight="10.25rem">
        {options.showLabels && <Text variant={TextVariant.overline}>Spinner</Text>}
        <CodeIconButton
          ariaLabel="View Spinner (loading button) code example"
          onClick={() => setLeftCodeOpen(true)}
        />
        <ButtonRow>
          <SpinnerButtonPreview
            variant={ButtonVariant.primary}
            loading={{
              isLoading: true,
              disableWhileLoading: false,
              spinnerVariant: activeVariant,
              loadingLabel: "Loading…",
            }}
          >
            Done!
          </SpinnerButtonPreview>
          <SpinnerButtonPreview
            variant={ButtonVariant.secondary}
            loading={{
              isLoading: true,
              disableWhileLoading: false,
              spinnerVariant: activeVariant,
              loadingLabel: "Please wait",
            }}
          >
            Complete
          </SpinnerButtonPreview>
        </ButtonRow>
      </LeftCard>
      <RightCard $basis="30rem" $minHeight="10.25rem">
        {options.showLabels && <Text variant={TextVariant.overline}>Spinner</Text>}
        <CodeIconButton
          ariaLabel="View Spinner variants code example"
          onClick={() => setRightCodeOpen(true)}
        />
        <SpinnerRow>
          {VARIANTS.map(({ key, label }) => (
            <SpinnerItem
              key={key}
              type="button"
              aria-label={`Select ${label} spinner`}
              aria-pressed={key === activeVariant}
              onClick={() => setActiveVariant(key)}
            >
              <Spinner variant={key} />
              {options.showLabels && <SpinnerLabel>{label}</SpinnerLabel>}
            </SpinnerItem>
          ))}
        </SpinnerRow>
      </RightCard>
      <CodeSnippetModal
        open={leftCodeOpen}
        onOpenChange={setLeftCodeOpen}
        title="Spinner"
        snippets={spinnerSnippets}
      />
      <CodeSnippetModal
        open={rightCodeOpen}
        onOpenChange={setRightCodeOpen}
        title="Spinner"
        snippets={spinnerSnippets}
      />
    </ShowcaseFlexRow>
  )
}

export { RowSpinner }
