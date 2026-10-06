<script lang="ts">
  import MarwesProvider from "../../lib/provider/MarwesProvider.svelte"

  let { Component, props = {} }: { Component: any; props?: Record<string, unknown> } = $props()
</script>

<MarwesProvider>
  <Component {...props} />
</MarwesProvider>
