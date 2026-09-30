import { ErrorToast, InfoToast, SuccessToast } from "@marwes-ui/react"
import { useState } from "react"

import { ShowcaseCard, ShowcaseGrid, ShowcaseStack } from "./showcase-layout"

function ToastShowcase(): JSX.Element {
  const [showInfo, setShowInfo] = useState(true)

  return (
    <ShowcaseGrid>
      <ShowcaseCard>
        <h3>Confirmation</h3>
        <p>A completed outcome uses a polite, non-interrupting announcement.</p>
        <SuccessToast variant="subtle">Your changes were saved.</SuccessToast>
      </ShowcaseCard>
      <ShowcaseCard>
        <h3>Assertive failure</h3>
        <p>A real failure reserves the assertive announcement urgency for itself.</p>
        <ErrorToast variant="subtle">Something went wrong. Try again.</ErrorToast>
      </ShowcaseCard>
      <ShowcaseCard>
        <h3>Dismissible</h3>
        <p>The dismiss control changes the visible state instead of acting as decoration.</p>
        <ShowcaseStack>
          {showInfo ? (
            <InfoToast variant="subtle" onDismiss={() => setShowInfo(false)}>
              New component guidance is available.
            </InfoToast>
          ) : (
            <span>Toast dismissed.</span>
          )}
        </ShowcaseStack>
      </ShowcaseCard>
    </ShowcaseGrid>
  )
}

export default ToastShowcase
