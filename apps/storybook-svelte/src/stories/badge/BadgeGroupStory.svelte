<script lang="ts">
  import { Badge, BadgeGroup } from "@marwes-ui/svelte"
  import type { BadgeVariant } from "@marwes-ui/core"

  interface Props {
    label?: string
    badges?: Array<{ variant: BadgeVariant; children: string }>
    className?: string
  }

  let { label = "Tags", badges = [], className }: Props = $props()
</script>

<BadgeGroup {label} {className}>
  {#each badges as badge}
    <Badge variant={badge.variant}>{badge.children}</Badge>
  {/each}
</BadgeGroup>
