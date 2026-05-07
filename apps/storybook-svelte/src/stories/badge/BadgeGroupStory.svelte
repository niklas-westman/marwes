<script lang="ts">
  import { Badge, BadgeGroup } from "@marwes-ui/svelte"
  import type { BadgeVariant } from "@marwes-ui/core"

  interface Props {
    label?: string
    badges?: Array<{ variant: BadgeVariant; children: string }>
  }

  let { label = "Tags", badges = [] }: Props = $props()
</script>

<BadgeGroup {label}>
  {#each badges as badge}
    <Badge variant={badge.variant}>{badge.children}</Badge>
  {/each}
</BadgeGroup>
