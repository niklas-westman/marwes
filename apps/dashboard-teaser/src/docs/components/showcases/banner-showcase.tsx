import { InfoBanner, LinkButton, SuccessBanner } from "@marwes-ui/react"
import { useState } from "react"

import { ShowcaseCard, ShowcaseGrid, ShowcaseStack } from "./showcase-layout"

function BannerShowcase(): JSX.Element {
  const [showDismissibleBanner, setShowDismissibleBanner] = useState(true)

  return (
    <ShowcaseGrid>
      <ShowcaseCard>
        <h3>Informational update</h3>
        <p>Persistent context uses an informational purpose banner.</p>
        <InfoBanner showIcon dismissible={false}>
          Scheduled maintenance starts at 18:00 UTC.
        </InfoBanner>
      </ShowcaseCard>
      <ShowcaseCard>
        <h3>Outcome with action</h3>
        <p>Actions are real controls whose names describe the result.</p>
        <SuccessBanner
          dismissible={false}
          action={<LinkButton href="#resources">View resources</LinkButton>}
        >
          Your documentation build is ready.
        </SuccessBanner>
      </ShowcaseCard>
      <ShowcaseCard>
        <h3>Dismissible message</h3>
        <p>The dismiss control changes the visible state instead of acting as decoration.</p>
        <ShowcaseStack>
          {showDismissibleBanner ? (
            <InfoBanner dismissible onDismiss={() => setShowDismissibleBanner(false)}>
              New component guidance is available.
            </InfoBanner>
          ) : (
            <span>Banner dismissed.</span>
          )}
        </ShowcaseStack>
      </ShowcaseCard>
    </ShowcaseGrid>
  )
}

export default BannerShowcase
