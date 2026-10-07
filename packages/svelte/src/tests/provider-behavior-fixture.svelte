<script lang="ts">
  import type { MarwesProviderOptions } from "@marwes-ui/core";
  import MarwesProvider from "../lib/provider/MarwesProvider.svelte";
  import ProviderBehaviorConsumer from "./provider-behavior-consumer.svelte";

  let providerProps: MarwesProviderOptions = $props();
</script>

<MarwesProvider {...providerProps}>
  <ProviderBehaviorConsumer />
</MarwesProvider>
