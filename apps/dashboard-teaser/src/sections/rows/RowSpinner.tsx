import { Button, ButtonVariant, Spinner } from "@marwes-ui/react"
import { useState } from "react"
import styled from "styled-components"

import { FlexCard } from "./shared"

const RowContainer = styled.div`
  display: flex;
  gap: 24px;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
  }
`

const LeftCard = styled(FlexCard)`
  max-width: 321px;
`

const RightCard = styled(FlexCard)``

const SectionLabel = styled.h4`
  font-family: "Instrument Sans", sans-serif;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--mw-color-text-muted, #595959);
`

const SpinnerRow = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  align-items: flex-start;
`

const SpinnerItem = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  border: none;
  background: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  transition: background 0.15s;

  &:hover {
    background: var(--mw-color-surface-subtle, #f5f5f5);
  }
`

const SpinnerLabel = styled.span`
  font-family: "Instrument Sans", sans-serif;
  font-size: 11px;
  color: var(--mw-color-text-muted, #595959);
`

const ButtonRow = styled.div`
  display: flex;
  gap: 16px;
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

function RowSpinner(): JSX.Element {
  const [activeVariant, setActiveVariant] = useState<SpinnerVariantKey>("ring")

  return (
    <RowContainer>
      <LeftCard>
        <SectionLabel>Spinner</SectionLabel>
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
      <RightCard>
        <SectionLabel>Spinner</SectionLabel>
        <SpinnerRow>
          {VARIANTS.map(({ key, label }) => (
            <SpinnerItem key={key} type="button" onClick={() => setActiveVariant(key)}>
              <Spinner variant={key} />
              <SpinnerLabel>{label}</SpinnerLabel>
            </SpinnerItem>
          ))}
        </SpinnerRow>
      </RightCard>
    </RowContainer>
  )
}

export { RowSpinner }
