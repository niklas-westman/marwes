import { H1, H2, H3 } from "@marwes-ui/react"

import { ShowcaseCard, ShowcaseGrid, ShowcaseStack } from "./showcase-layout"

function HeadingShowcase(): JSX.Element {
  return (
    <ShowcaseGrid>
      <ShowcaseCard>
        <h3>Semantic ladder</h3>
        <p>Each level matches both the visible size and the real document outline.</p>
        <ShowcaseStack>
          <H1>Heading 1</H1>
          <H2>Heading 2</H2>
          <H3>Heading 3</H3>
        </ShowcaseStack>
      </ShowcaseCard>
      <ShowcaseCard>
        <h3>Size decoupled from level</h3>
        <p>A section heading can borrow a larger visual size without becoming an H1.</p>
        <ShowcaseStack>
          <H2 size="h1">Section heading, H1 size</H2>
        </ShowcaseStack>
      </ShowcaseCard>
      <ShowcaseCard>
        <h3>Nested subsection</h3>
        <p>Deeper structure stays sequential instead of skipping a level for visual effect.</p>
        <ShowcaseStack>
          <H2>Parent section</H2>
          <H3>Child subsection</H3>
        </ShowcaseStack>
      </ShowcaseCard>
    </ShowcaseGrid>
  )
}

export default HeadingShowcase
