<script lang="ts">
  import {
    DestructiveButton,
    MarwesProvider,
    PrimaryButton,
    SecondaryButton,
    TextButton,
    ThemeMode,
  } from "@marwes-ui/svelte";

  let { path }: { path: string } = $props();
</script>

<MarwesProvider enableSystem={false} theme={{ mode: ThemeMode.light }}>
  {#if path === "/reflection/button/basic/light"}
    <PrimaryButton>Label</PrimaryButton>
  {:else if path === "/reflection/button/secondary/light"}
    <SecondaryButton>Label</SecondaryButton>
  {:else if path === "/reflection/button/text/light"}
    <TextButton>Label</TextButton>
  {:else if path === "/reflection/button/destructive/light"}
    <DestructiveButton>Delete</DestructiveButton>
  {/if}
</MarwesProvider>
