<script lang="ts">
  import { MarwesProvider, ThemeMode } from "@marwes-ui/svelte";
  import type { Snippet } from "svelte";

  interface Props {
    children?: Snippet;
  }

  const { children }: Props = $props();
</script>

<MarwesProvider theme={{ mode: ThemeMode.light }}>
  <div style="min-height: 100vh; padding: 24px;">
    {@render children?.()}
  </div>
</MarwesProvider>
