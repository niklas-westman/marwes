import { Banner, InfoBanner } from "@marwes-ui/react"
import styled from "styled-components"

import type { ComponentDisplayOptions } from "../playground-settings"
import { FlexAreaCard, ShowcaseFlexRow, ShowcaseSectionLabel, ShowcaseStack } from "./shared"

const BannerCard = styled(FlexAreaCard)`
  ${({ theme }) => theme.media.wideDesktopAndAbove} {
    gap: ${({ theme }) => theme.spacing.sp16};
    padding: ${({ theme }) => theme.spacing.sp24};
  }
`

const BannerStack = styled(ShowcaseStack)``

type RowBannerProps = {
  options: ComponentDisplayOptions
}

function RowBanner({ options }: RowBannerProps): JSX.Element {
  return (
    <ShowcaseFlexRow>
      <BannerCard $basis="100%" $minHeight="13.5rem">
        {options.showLabels && <ShowcaseSectionLabel>Banner</ShowcaseSectionLabel>}
        <BannerStack>
          <Banner showIcon={options.showIcons}>
            Banner message — describe the event, update, or action needed here.
          </Banner>
          <InfoBanner showIcon={options.showIcons}>
            Banner message — describe the event, update, or action needed here.
          </InfoBanner>
        </BannerStack>
      </BannerCard>
    </ShowcaseFlexRow>
  )
}

export { RowBanner }
