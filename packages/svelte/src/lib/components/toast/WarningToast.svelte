<script lang="ts">
  import { IconName, createPurposeSemanticAttributes } from "@marwes-ui/core";
  import Icon from "../icon/Icon.svelte";
  import Toast from "./Toast.svelte";
  import type { ToastProps } from "./types.js";

  let { dataAttributes, variant, ariaLive, icon, ...props }: ToastProps = $props();
  const hasCustomIcon = $derived(icon !== undefined);
</script>

<Toast
  {...props}
  variant={variant ?? "outline"}
  ariaLive={ariaLive ?? "polite"}
  dataAttributes={{ ...dataAttributes, ...createPurposeSemanticAttributes("warning-toast") }}
>
  {#snippet icon()}
    {#if hasCustomIcon}
      {@render icon?.()}
    {:else}
      <Icon name={IconName.AlertTriangle} decorative />
    {/if}
  {/snippet}
</Toast>
