<script lang="ts">
  import { Banner } from "@marwes-ui/svelte"
  import { BannerVariant } from "@marwes-ui/core"

  const variants = Object.values(BannerVariant)

  function capitalize(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1)
  }
</script>

<div style="display: flex; flex-direction: column; gap: 12px; width: 100%;">
  {#each variants as variant}
    <Banner {variant} showIcon dismissible>
      {capitalize(variant)} — Banner message describing the event or action needed.
    </Banner>
  {/each}
</div>
