import { Banner, InfoBanner } from "@marwes-ui/react"
import styled from "styled-components"

import { FlexCard, ShowcaseRow, ShowcaseSectionLabel, ShowcaseStack } from "./shared"

const BannerCard = styled(FlexCard)``

function RowBanner(): JSX.Element {
  return (
    <ShowcaseRow>
      <BannerCard>
        <ShowcaseSectionLabel>Banner</ShowcaseSectionLabel>
        <ShowcaseStack>
          <Banner showIcon={false}>
            Banner message — describe the event, update, or action needed here.
          </Banner>
          <InfoBanner>
            Banner message — describe the event, update, or action needed here.
          </InfoBanner>
        </ShowcaseStack>
      </BannerCard>
    </ShowcaseRow>
  )
}

export { RowBanner }
