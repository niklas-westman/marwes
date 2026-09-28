import {
  BadgeGroup,
  BadgeVariant,
  NotificationBadge,
  PriorityBadge,
  StatusBadge,
} from "@marwes-ui/react"

import { ShowcaseCard, ShowcaseGrid, ShowcasePreview } from "./showcase-layout"

function BadgeShowcase(): JSX.Element {
  return (
    <ShowcaseGrid>
      <ShowcaseCard>
        <h3>Status and priority</h3>
        <p>Purpose badges make a passive label’s meaning explicit.</p>
        <ShowcasePreview>
          <StatusBadge variant={BadgeVariant.success}>Active</StatusBadge>
          <PriorityBadge variant={BadgeVariant.warning}>High priority</PriorityBadge>
        </ShowcasePreview>
      </ShowcaseCard>
      <ShowcaseCard>
        <h3>Named notification count</h3>
        <p>Numeric-only content carries a fuller accessible label.</p>
        <ShowcasePreview>
          <NotificationBadge variant={BadgeVariant.info} ariaLabel="3 unread messages">
            3
          </NotificationBadge>
        </ShowcasePreview>
      </ShowcaseCard>
      <ShowcaseCard>
        <h3>Labeled group</h3>
        <p>Related passive badges stay connected to a visible group label.</p>
        <ShowcasePreview>
          <BadgeGroup label="Deployment status">
            <StatusBadge variant={BadgeVariant.success}>Production</StatusBadge>
            <StatusBadge variant={BadgeVariant.info}>Monitored</StatusBadge>
          </BadgeGroup>
        </ShowcasePreview>
      </ShowcaseCard>
    </ShowcaseGrid>
  )
}

export default BadgeShowcase
