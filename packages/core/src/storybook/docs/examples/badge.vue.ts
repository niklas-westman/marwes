export const badgeExamples = {
  purposeComponents: `\`\`\`vue
<script setup lang="ts">
import { StatusBadge, PriorityBadge, NotificationBadge } from "@marwes-ui/vue"
</script>

<template>
  <!-- Operational status — auto-sets data-purpose="status" -->
  <StatusBadge variant="success">Active</StatusBadge>
  <StatusBadge variant="error">Offline</StatusBadge>

  <!-- Priority levels — auto-sets data-purpose="priority" -->
  <PriorityBadge variant="error">Critical</PriorityBadge>
  <PriorityBadge variant="warning">High</PriorityBadge>

  <!-- Notification counts — auto-sets data-purpose="notification" -->
  <NotificationBadge variant="info" ariaLabel="5 unread messages">5</NotificationBadge>
</template>
\`\`\``,

  badgeGroup: `\`\`\`vue
<script setup lang="ts">
import { BadgeGroup, Badge } from "@marwes-ui/vue"
</script>

<template>
  <BadgeGroup label="Tags">
    <Badge variant="info">Frontend</Badge>
    <Badge variant="success">Approved</Badge>
    <Badge variant="warning">Review</Badge>
  </BadgeGroup>
</template>
\`\`\``,

  atom: `\`\`\`vue
<script setup lang="ts">
import { Badge } from "@marwes-ui/vue"
</script>

<template>
  <Badge variant="success">Active</Badge>
  <Badge variant="error" ariaLabel="critical status">!</Badge>
</template>
\`\`\``,

  a11yNumericBadge: `\`\`\`vue
<!-- ❌ Screen reader sees only "5" with no context -->
<NotificationBadge variant="info">5</NotificationBadge>

<!-- ✅ Screen reader announces "5 unread messages" -->
<NotificationBadge variant="info" ariaLabel="5 unread messages">5</NotificationBadge>
\`\`\``,
}
