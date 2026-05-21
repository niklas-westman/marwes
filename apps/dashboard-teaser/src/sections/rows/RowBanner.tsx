import { Banner, InfoBanner } from "@marwes-ui/react"
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

const BannerCard = styled(FlexCard)`
  border: 1px solid var(--mw-color-border, #d8d8d8);
`

const SectionLabel = styled.h4`
  font-family: "Instrument Sans", sans-serif;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--mw-color-text-muted, #595959);
`

const BannerStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

function RowBanner(): JSX.Element {
  return (
    <RowContainer>
      <BannerCard>
        <SectionLabel>Banner</SectionLabel>
        <BannerStack>
          <Banner showIcon={false}>
            Banner message — describe the event, update, or action needed here.
          </Banner>
          <InfoBanner>
            Banner message — describe the event, update, or action needed here.
          </InfoBanner>
        </BannerStack>
      </BannerCard>
    </RowContainer>
  )
}

export { RowBanner }
