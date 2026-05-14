<script lang="ts">
  import TabGroup from "./TabGroup.svelte";
  import type { ContentTabsProps } from "./types.js";
  let { ariaLabel = "Content tabs", dataAttributes, ...props }: ContentTabsProps = $props();
</script>

<TabGroup
  {...props}
  {ariaLabel}
  dataAttributes={{ ...dataAttributes, "data-purpose": "content-tabs" }}
/>
