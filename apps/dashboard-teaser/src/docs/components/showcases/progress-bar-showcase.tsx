import { ProgressBar } from "@marwes-ui/react"

import { ShowcaseCard, ShowcaseGrid, ShowcaseStack } from "./showcase-layout"

function ProgressBarShowcase(): JSX.Element {
  return (
    <ShowcaseGrid>
      <ShowcaseCard>
        <h3>Setup progress</h3>
        <p>Known completion uses a visible label and percentage.</p>
        <ShowcaseStack>
          <ProgressBar label="Workspace setup" value={64} />
        </ShowcaseStack>
      </ShowcaseCard>
      <ShowcaseCard>
        <h3>Compact progress</h3>
        <p>The small track preserves the same read-only progress semantics.</p>
        <ShowcaseStack>
          <ProgressBar label="File upload" value={38} size="small" />
        </ShowcaseStack>
      </ShowcaseCard>
      <ShowcaseCard>
        <h3>Visually hidden label</h3>
        <p>An explicit accessible name remains when the visible label is hidden.</p>
        <ShowcaseStack>
          <ProgressBar
            ariaLabel="Data import progress"
            value={82}
            showLabel={false}
            showPercentage
          />
        </ShowcaseStack>
      </ShowcaseCard>
    </ShowcaseGrid>
  )
}

export default ProgressBarShowcase
