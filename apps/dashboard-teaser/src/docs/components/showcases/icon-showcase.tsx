import { Icon, IconName, PrimaryButton } from "@marwes-ui/react"

import { ButtonRow, ShowcaseCard, ShowcaseGrid } from "./showcase-layout"

function IconShowcase(): JSX.Element {
  return (
    <ShowcaseGrid>
      <ShowcaseCard>
        <h3>Decorative, next to visible text</h3>
        <p>The icon adds no independent meaning, so it stays hidden from assistive technology.</p>
        <ButtonRow>
          <PrimaryButton>
            <Icon name={IconName.Plus} decorative size="sm" /> Create item
          </PrimaryButton>
        </ButtonRow>
      </ShowcaseCard>
      <ShowcaseCard>
        <h3>Standalone, informative</h3>
        <p>With no visible label, the icon carries its own truthful accessible name.</p>
        <ButtonRow>
          <Icon name={IconName.Search} ariaLabel="Search" size="md" />
        </ButtonRow>
      </ShowcaseCard>
      <ShowcaseCard>
        <h3>Size comparison</h3>
        <p>The same glyph scales through the shared size and stroke-weight tokens.</p>
        <ButtonRow>
          <Icon name={IconName.Star} decorative size="xs" />
          <Icon name={IconName.Star} decorative size="sm" />
          <Icon name={IconName.Star} decorative size="md" />
          <Icon name={IconName.Star} decorative size="lg" />
        </ButtonRow>
      </ShowcaseCard>
    </ShowcaseGrid>
  )
}

export default IconShowcase
