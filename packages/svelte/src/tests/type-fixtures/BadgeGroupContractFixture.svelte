<script lang="ts">
  import BadgeGroup from "../../lib/components/badge/BadgeGroup.svelte"
  import type { BadgeGroupProps } from "../../lib/components/badge/types.js"
  import MarwesProvider from "../../lib/provider/MarwesProvider.svelte"

  let { label, children, class: className, id }: BadgeGroupProps = $props()
</script>

<MarwesProvider>
  <BadgeGroup {label} {id} class={className}>
    {@render children?.()}
  </BadgeGroup>
</MarwesProvider>
