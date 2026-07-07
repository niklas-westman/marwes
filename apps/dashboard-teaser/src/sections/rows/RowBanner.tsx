import { Banner, InfoBanner } from "@marwes-ui/react"
import { useState } from "react"
import styled from "styled-components"

import { CodeIconButton } from "../../components/CodeIconButton"
import { CodeSnippetModal } from "../../components/CodeSnippetModal"
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
  const [codeOpen, setCodeOpen] = useState(false)

  return (
    <ShowcaseFlexRow>
      <BannerCard $basis="100%" $minHeight="13.5rem">
        {options.showLabels && <ShowcaseSectionLabel>Banner</ShowcaseSectionLabel>}
        <CodeIconButton ariaLabel="View Banner code example" onClick={() => setCodeOpen(true)} />
        <BannerStack>
          <Banner showIcon={options.showIcons}>
            Banner message — describe the event, update, or action needed here.
          </Banner>
          <InfoBanner showIcon={options.showIcons}>
            Banner message — describe the event, update, or action needed here.
          </InfoBanner>
        </BannerStack>
      </BannerCard>
      <CodeSnippetModal
        open={codeOpen}
        onOpenChange={setCodeOpen}
        title="Banner"
        snippets={bannerSnippets}
      />
    </ShowcaseFlexRow>
  )
}

export { RowBanner }
