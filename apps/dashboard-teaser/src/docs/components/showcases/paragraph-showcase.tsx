import { Paragraph } from "@marwes-ui/react"

import { ShowcaseCard, ShowcaseGrid, ShowcaseStack } from "./showcase-layout"

function ParagraphShowcase(): JSX.Element {
  return (
    <ShowcaseGrid>
      <ShowcaseCard>
        <h3>Reading size ladder</h3>
        <p>Body copy scales through small, medium, and large without changing meaning.</p>
        <ShowcaseStack>
          <Paragraph size="lg">Large body copy for a prominent lead paragraph.</Paragraph>
          <Paragraph size="md">Medium body copy for standard reading content.</Paragraph>
          <Paragraph size="sm">Small body copy for dense, secondary content.</Paragraph>
        </ShowcaseStack>
      </ShowcaseCard>
      <ShowcaseCard>
        <h3>Paired with a heading</h3>
        <p>Paragraph composes naturally as the reading content under a section heading.</p>
        <ShowcaseStack>
          <h4>Release notes</h4>
          <Paragraph size="md">
            This release focuses on accessibility fixes across form components.
          </Paragraph>
        </ShowcaseStack>
      </ShowcaseCard>
      <ShowcaseCard>
        <h3>Multi-sentence content</h3>
        <p>Longer passages keep consistent line height and measure at every size.</p>
        <ShowcaseStack>
          <Paragraph size="md">
            Marwes components ship with built-in accessibility wiring. Consumers remain responsible
            for truthful labels, instructions, and error messages.
          </Paragraph>
        </ShowcaseStack>
      </ShowcaseCard>
    </ShowcaseGrid>
  )
}

export default ParagraphShowcase
