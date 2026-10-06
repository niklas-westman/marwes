<script lang="ts">
  import MarwesProvider from "../../lib/provider/MarwesProvider.svelte"

  let { Component, initial, props = {} }: { Component: any; initial: string | number; props?: Record<string, unknown> } = $props()
  let value = $state(initial)
</script>

<MarwesProvider>
  <Component {...props} bind:value />
</MarwesProvider>
<output data-testid="bound">{value}</output>
