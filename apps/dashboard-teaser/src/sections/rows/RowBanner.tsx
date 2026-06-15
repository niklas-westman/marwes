import { Banner, InfoBanner } from "@marwes-ui/react"
import styled from "styled-components"

import { FlexCard, ShowcaseRow, ShowcaseSectionLabel, ShowcaseStack } from "./shared"

const BannerCard = styled(FlexCard)`
  ${({ theme }) => theme.media.wideDesktopAndAbove} {
    gap: ${({ theme }) => theme.spacing.sp16};
    padding: ${({ theme }) => theme.spacing.sp24};
  }
`

const BannerStack = styled(ShowcaseStack)``

function RowBanner(): JSX.Element {
  return (
    <ShowcaseRow>
      <BannerCard>
        <ShowcaseSectionLabel>Banner</ShowcaseSectionLabel>
        <BannerStack>
          <Banner showIcon={false}>
            Banner message — describe the event, update, or action needed here.
          </Banner>
          <InfoBanner>
            Banner message — describe the event, update, or action needed here.
          </InfoBanner>
        </BannerStack>
      </BannerCard>
    </ShowcaseRow>
  )
}

export { RowBanner }
