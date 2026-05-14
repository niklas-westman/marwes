<script lang="ts">
  import TabGroup from "./TabGroup.svelte";
  import type { NavigationTabsProps } from "./types.js";
  let { ariaLabel = "Navigation tabs", dataAttributes, ...props }: NavigationTabsProps = $props();
</script>

<TabGroup
  {...props}
  {ariaLabel}
  dataAttributes={{ ...dataAttributes, "data-purpose": "navigation-tabs" }}
/>
