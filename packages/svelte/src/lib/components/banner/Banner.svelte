<script lang="ts">
  import { createBannerRecipe } from "@marwes-ui/core";
  import { mergeClass } from "../../internal/merge-class.js";
  import type { BannerProps } from "./types.js";

  let {
    children,
    icon,
    action,
    ondismiss,
    class: className,
    id,
    ...coreProps
  }: BannerProps = $props();

  const kit = $derived(createBannerRecipe({
    ...coreProps,
    showAction: coreProps.showAction ?? Boolean(action),
  }));
  const mergedClass = $derived(mergeClass(kit.root.className, className));
</script>

<div
  {id}
  class={mergedClass}
  role={kit.root.a11y.role}
  aria-label={kit.root.a11y.ariaLabel}
  aria-live={kit.root.a11y.ariaLive}
  {...kit.root.dataAttributes}
>
  <div class={kit.content.className}>
    {#if kit.icon.visible}
      <span class={kit.icon.className}>
        {#if icon}
          {@render icon()}
        {:else}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
          </svg>
        {/if}
      </span>
    {/if}
    <span class={kit.message.className}>
      {@render children?.()}
    </span>
  </div>
  {#if kit.action.visible && action}
    <div class={kit.action.className}>
      {@render action()}
    </div>
  {/if}
  {#if kit.dismiss.visible}
    <button
      type="button"
      class={kit.dismiss.className}
      aria-label={kit.dismiss.ariaLabel}
      onclick={ondismiss}
    ></button>
  {/if}
</div>
