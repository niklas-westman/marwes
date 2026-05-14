<script lang="ts">
  import { Badge } from "@marwes-ui/svelte"
  import { BadgeVariant } from "@marwes-ui/core"

  const variants = Object.values(BadgeVariant)

  function capitalize(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1)
  }
</script>

<div style="display: flex; flex-wrap: wrap; gap: 8px; align-items: center;">
  {#each variants as variant}
    <Badge {variant}>{capitalize(variant)}</Badge>
  {/each}
</div>
