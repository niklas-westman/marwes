<script lang="ts">
  import TabGroup from "./TabGroup.svelte";
  import type { TabGroupProps } from "./types.js";
  let { ariaLabel = "Settings tabs", ...props }: TabGroupProps = $props();
</script>
<div data-purpose="settings-tabs">
  <TabGroup {...props} {ariaLabel} />
</div>
