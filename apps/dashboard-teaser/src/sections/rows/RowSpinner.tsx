import { Button, ButtonVariant, Spinner, Text, TextVariant } from "@marwes-ui/react"
import { useState } from "react"
import styled from "styled-components"

import { FlexCard, ShowcaseRow } from "./shared"

const LeftCard = styled(FlexCard)`
  max-width: 20.0625rem;
`

const RightCard = styled(FlexCard)``

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

function RowSpinner(): JSX.Element {
  const [activeVariant, setActiveVariant] = useState<SpinnerVariantKey>("ring")

  return (
    <ShowcaseRow>
      <LeftCard>
        <Text variant={TextVariant.overline}>Spinner</Text>
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
        <Text variant={TextVariant.overline}>Spinner</Text>
        <SpinnerRow>
          {VARIANTS.map(({ key, label }) => (
            <SpinnerItem key={key} type="button" onClick={() => setActiveVariant(key)}>
              <Spinner variant={key} />
              <SpinnerLabel>{label}</SpinnerLabel>
            </SpinnerItem>
          ))}
        </SpinnerRow>
      </RightCard>
    </ShowcaseRow>
  )
}

export { RowSpinner }
