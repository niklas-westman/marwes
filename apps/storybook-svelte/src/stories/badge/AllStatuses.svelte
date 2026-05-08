<script lang="ts">
  import { StatusBadge } from "@marwes-ui/svelte"
</script>

<div style="display: flex; flex-wrap: wrap; gap: 8px; align-items: center;">
  <StatusBadge>Active</StatusBadge>
  <StatusBadge>Offline</StatusBadge>
  <StatusBadge>Degraded</StatusBadge>
  <StatusBadge>Unknown</StatusBadge>
</div>
