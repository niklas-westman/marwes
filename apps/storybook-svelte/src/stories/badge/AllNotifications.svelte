<script lang="ts">
  import { NotificationBadge } from "@marwes-ui/svelte"
</script>

<div style="display: flex; flex-wrap: wrap; gap: 8px; align-items: center;">
  <NotificationBadge ariaLabel="3 unread notifications">3</NotificationBadge>
  <NotificationBadge ariaLabel="99+ unread notifications">99+</NotificationBadge>
</div>
