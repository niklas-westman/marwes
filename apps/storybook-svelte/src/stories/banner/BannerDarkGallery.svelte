<script lang="ts">
  import { Banner, MarwesProvider, ThemeMode } from "@marwes-ui/svelte"
  import { BannerVariant } from "@marwes-ui/core"

  const variants = Object.values(BannerVariant)

  function capitalize(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1)
  }
</script>

<MarwesProvider theme={{ mode: ThemeMode.dark }}>
  <div style="display: flex; flex-direction: column; gap: 12px; width: 100%; padding: 16px; background: #0f0f0f; border-radius: 8px;">
    {#each variants as variant}
      <Banner {variant} showIcon dismissible>
        {capitalize(variant)} — Banner message in dark mode.
      </Banner>
    {/each}
  </div>
</MarwesProvider>
