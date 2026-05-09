export const badgeExamples = {
  purposeComponents: `\`\`\`tsx
import { StatusBadge, PriorityBadge, NotificationBadge } from "@marwes-ui/react"

// Operational status — auto-sets data-purpose="status"
<StatusBadge variant={BadgeVariant.success}>Active</StatusBadge>
<StatusBadge variant={BadgeVariant.error}>Offline</StatusBadge>

// Priority levels — auto-sets data-purpose="priority"
<PriorityBadge variant={BadgeVariant.error}>Critical</PriorityBadge>
<PriorityBadge variant={BadgeVariant.warning}>High</PriorityBadge>

// Notification counts — auto-sets data-purpose="notification"
<NotificationBadge variant={BadgeVariant.info} ariaLabel="5 unread messages">5</NotificationBadge>
\`\`\``,

  badgeGroup: `\`\`\`tsx
import { BadgeGroup, Badge } from "@marwes-ui/react"

<BadgeGroup label="Tags">
  <Badge variant={BadgeVariant.info}>Frontend</Badge>
  <Badge variant={BadgeVariant.success}>Approved</Badge>
  <Badge variant={BadgeVariant.warning}>Review</Badge>
</BadgeGroup>
\`\`\``,

  atom: `\`\`\`tsx
import { Badge } from "@marwes-ui/react"

<Badge variant={BadgeVariant.success}>Active</Badge>
<Badge variant={BadgeVariant.error} ariaLabel="critical status">!</Badge>
\`\`\``,

  a11yNumericBadge: `\`\`\`tsx
// ❌ Screen reader sees only "5" with no context
<NotificationBadge variant={BadgeVariant.info}>5</NotificationBadge>

// ✅ Screen reader announces "5 unread messages"
<NotificationBadge variant={BadgeVariant.info} ariaLabel="5 unread messages">5</NotificationBadge>
\`\`\``,
}
