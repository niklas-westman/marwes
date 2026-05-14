<script lang="ts">
  import TabGroup from "./TabGroup.svelte";
  import type { SettingsTabsProps } from "./types.js";
  let { ariaLabel = "Settings tabs", dataAttributes, ...props }: SettingsTabsProps = $props();
</script>

<TabGroup
  {...props}
  {ariaLabel}
  dataAttributes={{ ...dataAttributes, "data-purpose": "settings-tabs" }}
/>
