import { Spinner } from "@marwes-ui/react"
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

const SpinnerButton = styled.button<{ $loading?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0 16px;
  border-radius: 8px;
  font-family: "Instrument Sans", sans-serif;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  border: 1px solid var(--mw-color-border, #e5e5e5);
  background: var(--mw-color-surface, #ffffff);
  color: var(--mw-color-text, #141414);
  opacity: ${(p) => (p.$loading ? 0.7 : 1)};
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
  const [loadingA, setLoadingA] = useState(true)
  const [loadingB, setLoadingB] = useState(true)

  return (
    <RowContainer>
      <LeftCard>
        <SectionLabel>Spinner</SectionLabel>
        <ButtonRow>
          <SpinnerButton type="button" $loading={loadingA} onClick={() => setLoadingA((v) => !v)}>
            {loadingA && <Spinner variant={activeVariant} size="sm" />}
            {loadingA ? "Loading…" : "Done!"}
          </SpinnerButton>
          <SpinnerButton type="button" $loading={loadingB} onClick={() => setLoadingB((v) => !v)}>
            {loadingB && <Spinner variant={activeVariant} size="sm" />}
            {loadingB ? "Please wait" : "Complete"}
          </SpinnerButton>
        </ButtonRow>
      </LeftCard>
      <RightCard>
        <SectionLabel>Spinner</SectionLabel>
        <SpinnerRow>
          {VARIANTS.map(({ key, label }) => (
            <SpinnerItem key={key} type="button" onClick={() => setActiveVariant(key)}>
              <Spinner variant={key} size={activeVariant === key ? "md" : undefined} />
              <SpinnerLabel>{label}</SpinnerLabel>
            </SpinnerItem>
          ))}
        </SpinnerRow>
      </RightCard>
    </RowContainer>
  )
}

export { RowSpinner }
