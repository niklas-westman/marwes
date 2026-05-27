<script lang="ts">
  import BrightnessSlider from "../../lib/components/slider/BrightnessSlider.svelte"
  import RadiusSlider from "../../lib/components/slider/RadiusSlider.svelte"
  import VolumeSlider from "../../lib/components/slider/VolumeSlider.svelte"
  import MarwesProvider from "../../lib/provider/MarwesProvider.svelte"

  interface Props {
    kind: "brightness" | "radius" | "volume"
    value?: number
    orientation?: "horizontal" | "vertical"
  }

  let { kind, value, orientation }: Props = $props()
</script>

<MarwesProvider>
  {#if kind === "brightness"}
    <BrightnessSlider {value} />
  {:else if kind === "radius"}
    <RadiusSlider {value} />
  {:else}
    <VolumeSlider {value} {orientation} />
  {/if}
</MarwesProvider>
