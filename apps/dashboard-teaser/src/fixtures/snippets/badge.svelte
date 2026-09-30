<script lang="ts">
  import { BadgeGroup, NotificationBadge, StatusBadge } from "@marwes-ui/svelte"
</script>

<BadgeGroup label="Account status">
  <StatusBadge variant="success">Active</StatusBadge>
  <NotificationBadge variant="info" ariaLabel="3 unread messages">3</NotificationBadge>
</BadgeGroup>
