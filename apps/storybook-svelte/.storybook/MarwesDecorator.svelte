<script lang="ts">
  import { MarwesProvider, ThemeMode } from "@marwes-ui/svelte";
  import type { Snippet } from "svelte";

  interface Props {
    children?: Snippet;
    isDocs?: boolean;
    mode?: "light" | "dark";
  }

  const { children, isDocs = false, mode = "light" }: Props = $props();

  const themeMode = $derived(mode === "dark" ? ThemeMode.dark : ThemeMode.light);
  const background = $derived(mode === "dark" ? "#0F0F0F" : "#ffffff");

  $effect(() => {
    document.body.style.background = background;
  });
</script>

<MarwesProvider theme={{ mode: themeMode }}>
  <div
    style:min-height={isDocs ? undefined : '100vh'}
    style:padding="24px"
    style:background={background}
  >
    {@render children?.()}
  </div>
</MarwesProvider>
