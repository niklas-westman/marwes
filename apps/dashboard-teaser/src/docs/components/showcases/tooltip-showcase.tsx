import { IconName, TooltipGroup } from "@marwes-ui/react"

import { ShowcaseCard, ShowcaseGrid, ShowcasePreview } from "./showcase-layout"

function TooltipShowcase(): JSX.Element {
  return (
    <ShowcaseGrid>
      <ShowcaseCard>
        <h3>Default trigger</h3>
        <p>Hover or focus the trigger to reveal supplementary help text.</p>
        <ShowcasePreview>
          <TooltipGroup
            content="Your profile is visible to workspace members."
            triggerLabel="About profile visibility"
          />
        </ShowcasePreview>
      </ShowcaseCard>
      <ShowcaseCard>
        <h3>Open state (reference)</h3>
        <p>Shown open here for reference; it normally reveals on hover or focus.</p>
        <ShowcasePreview>
          <TooltipGroup
            content="Two-factor authentication is required for admin roles."
            triggerLabel="About two-factor authentication"
            defaultOpen
          />
        </ShowcasePreview>
      </ShowcaseCard>
      <ShowcaseCard>
        <h3>Custom icon, longer content</h3>
        <p>Supplementary detail stays optional and never replaces required page content.</p>
        <ShowcasePreview>
          <TooltipGroup
            icon={IconName.Info}
            content="Exports include every field visible in your current view, plus internal ids used for support requests."
            triggerLabel="About export contents"
            defaultOpen
          />
        </ShowcasePreview>
      </ShowcaseCard>
    </ShowcaseGrid>
  )
}

export default TooltipShowcase
