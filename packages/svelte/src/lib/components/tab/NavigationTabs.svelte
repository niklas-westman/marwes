<script lang="ts">
  import TabGroup from "./TabGroup.svelte";
  import type { TabGroupProps } from "./types.js";
  let { ariaLabel = "Navigation tabs", ...props }: TabGroupProps = $props();
</script>
<div data-purpose="navigation-tabs">
  <TabGroup {...props} {ariaLabel} />
</div>
