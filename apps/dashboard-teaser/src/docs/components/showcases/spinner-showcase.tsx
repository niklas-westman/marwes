import { EmptyStateSpinner, PrimaryButton, Spinner } from "@marwes-ui/react"

import { ShowcaseCard, ShowcaseGrid, ShowcasePreview } from "./showcase-layout"

function SpinnerShowcase(): JSX.Element {
  return (
    <ShowcaseGrid>
      <ShowcaseCard>
        <h3>Button loading</h3>
        <p>The Button loading API owns the action state and compact spinner.</p>
        <ShowcasePreview>
          <PrimaryButton loading={{ isLoading: true, loadingLabel: "Saving" }}>
            Save changes
          </PrimaryButton>
        </ShowcasePreview>
      </ShowcaseCard>
      <ShowcaseCard>
        <h3>Empty-state treatment</h3>
        <p>A decorative context wrapper supports nearby visible loading text.</p>
        <ShowcasePreview>
          <EmptyStateSpinner />
          <span>Loading dashboard</span>
        </ShowcasePreview>
      </ShowcaseCard>
      <ShowcaseCard>
        <h3>Standalone status</h3>
        <p>Custom contexts need one truthful accessible status name.</p>
        <ShowcasePreview>
          <Spinner decorative={false} ariaLabel="Loading account activity" variant="ring" />
        </ShowcasePreview>
      </ShowcaseCard>
    </ShowcaseGrid>
  )
}

export default SpinnerShowcase
