<script lang="ts">
  import type { Component } from "svelte"
  import * as components from "../../lib/index.js"
  import Checkbox from "../../lib/components/checkbox/Checkbox.svelte"
  import MarwesProvider from "../../lib/provider/MarwesProvider.svelte"

  let { componentName, componentProps = {} }: {
    componentName: keyof typeof components
    componentProps?: Record<string, unknown>
  } = $props()

  const SelectedComponent = $derived(components[componentName] as unknown as Component<Record<string, unknown>>)
</script>

<MarwesProvider>
  <SelectedComponent {...componentProps}>
    {#if componentName === "CheckboxGroupField"}
      <label><Checkbox ariaLabel="Email" />Email</label>
      <label><Checkbox ariaLabel="SMS" checked />SMS</label>
    {:else}
      Hydration content
    {/if}
  </SelectedComponent>
</MarwesProvider>
