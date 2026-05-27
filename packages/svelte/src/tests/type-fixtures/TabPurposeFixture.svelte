<script lang="ts">
  import ContentTabs from "../../lib/components/tab/ContentTabs.svelte"
  import NavigationTabs from "../../lib/components/tab/NavigationTabs.svelte"
  import SettingsTabs from "../../lib/components/tab/SettingsTabs.svelte"
  import type { TabGroupItem } from "../../lib/components/tab/types.js"
  import MarwesProvider from "../../lib/provider/MarwesProvider.svelte"

  interface Props {
    kind: "content" | "navigation" | "settings"
    label?: string
    tabs: TabGroupItem[]
  }

  let { kind, label, tabs }: Props = $props()
</script>

<MarwesProvider>
  {#if kind === "content"}
    <ContentTabs {label} {tabs} />
  {:else if kind === "navigation"}
    <NavigationTabs {label} {tabs} />
  {:else}
    <SettingsTabs {label} {tabs} />
  {/if}
</MarwesProvider>
