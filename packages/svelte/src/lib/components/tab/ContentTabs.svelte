<script lang="ts">
  import TabGroup from "./TabGroup.svelte";
  import type { TabGroupProps } from "./types.js";
  let { ariaLabel = "Content tabs", ...props }: TabGroupProps = $props();
</script>
<div data-purpose="content-tabs">
  <TabGroup {...props} {ariaLabel} />
</div>
