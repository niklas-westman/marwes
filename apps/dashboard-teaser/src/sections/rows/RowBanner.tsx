import { Banner, InfoBanner } from "@marwes-ui/react"
import { memo } from "react"
import styled from "styled-components"

import { SnippetButton } from "../../components/SnippetButton"
import type { ComponentDisplayOptions } from "../playground-settings"
import { bannerSnippets } from "./banner-snippets"
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
        <SnippetButton title="Banner" snippets={bannerSnippets} />
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

const MemoizedRowBanner = memo(RowBanner)
export { MemoizedRowBanner as RowBanner }
