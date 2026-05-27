<script lang="ts">
  import TabGroup from "../../lib/components/tab/TabGroup.svelte"
  import type { TabGroupProps } from "../../lib/components/tab/types.js"
  import MarwesProvider from "../../lib/provider/MarwesProvider.svelte"

  let {
    id,
    label,
    ariaLabel,
    tabs,
    activeTab,
    defaultActiveTab,
    onactivetabchange,
    dataAttributes,
    class: className,
  }: TabGroupProps = $props()
</script>

<MarwesProvider>
  <TabGroup
    {id}
    {label}
    {ariaLabel}
    {tabs}
    {activeTab}
    {defaultActiveTab}
    {onactivetabchange}
    {dataAttributes}
    class={className}
  />
</MarwesProvider>
