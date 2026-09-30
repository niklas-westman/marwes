import { Text, TextVariant } from "@marwes-ui/react"

import { ShowcaseCard, ShowcaseGrid, ShowcaseStack } from "./showcase-layout"

function TextShowcase(): JSX.Element {
  return (
    <ShowcaseGrid>
      <ShowcaseCard>
        <h3>Variant ladder</h3>
        <p>Each variant is a distinct visual weight, from display copy down to overlines.</p>
        <ShowcaseStack>
          <Text variant={TextVariant.display}>Display</Text>
          <Text variant={TextVariant.label}>Label</Text>
          <Text variant={TextVariant.labelSmall}>Label small</Text>
          <Text variant={TextVariant.caption}>Caption</Text>
          <Text variant={TextVariant.overline}>Overline</Text>
        </ShowcaseStack>
      </ShowcaseCard>
      <ShowcaseCard>
        <h3>Rendered tag changes, look stays</h3>
        <p>The `as` prop swaps the underlying element without changing the visual variant.</p>
        <ShowcaseStack>
          <Text as="p" variant={TextVariant.caption}>
            Rendered as a real paragraph element.
          </Text>
        </ShowcaseStack>
      </ShowcaseCard>
      <ShowcaseCard>
        <h3>Semantic heading depth, display variant</h3>
        <p>headingLevel keeps a real H4 in the outline while the visual style stays an overline.</p>
        <ShowcaseStack>
          <Text headingLevel={4} variant={TextVariant.overline}>
            Section label acting as a real heading
          </Text>
        </ShowcaseStack>
      </ShowcaseCard>
    </ShowcaseGrid>
  )
}

export default TextShowcase
