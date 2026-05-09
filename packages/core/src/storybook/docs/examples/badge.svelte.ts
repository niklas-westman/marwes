export const badgeExamples = {
  purposeComponents: `\`\`\`svelte
<script>
  import { StatusBadge, PriorityBadge, NotificationBadge } from "@marwes-ui/svelte"
</script>

<!-- Operational status — auto-sets data-purpose="status" -->
<StatusBadge variant="success">Active</StatusBadge>
<StatusBadge variant="error">Offline</StatusBadge>

<!-- Priority levels — auto-sets data-purpose="priority" -->
<PriorityBadge variant="error">Critical</PriorityBadge>
<PriorityBadge variant="warning">High</PriorityBadge>

<!-- Notification counts — auto-sets data-purpose="notification" -->
<NotificationBadge variant="info" ariaLabel="5 unread messages">5</NotificationBadge>
\`\`\``,

  badgeGroup: `\`\`\`svelte
<script>
  import { Badge, BadgeGroup } from "@marwes-ui/svelte"
</script>

<BadgeGroup label="Tags">
  <Badge variant="info">Frontend</Badge>
  <Badge variant="success">Approved</Badge>
  <Badge variant="warning">Review</Badge>
</BadgeGroup>
\`\`\``,

  atom: `\`\`\`svelte
<script>
  import { Badge } from "@marwes-ui/svelte"
</script>

<Badge variant="success">Active</Badge>
<Badge variant="error" ariaLabel="critical status">!</Badge>
\`\`\``,

  a11yNumericBadge: `\`\`\`svelte
<!-- ❌ Screen reader sees only "5" with no context -->
<NotificationBadge variant="info">5</NotificationBadge>

<!-- ✅ Screen reader announces "5 unread messages" -->
<NotificationBadge variant="info" ariaLabel="5 unread messages">5</NotificationBadge>
\`\`\``,
}
