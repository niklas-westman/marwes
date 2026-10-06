<script lang="ts">
  import { createToastRecipe, toToastHtmlAttributes } from "@marwes-ui/core";
  import { mergeClass } from "../../internal/merge-class.js";
  import type { ToastProps } from "./types.js";

  let {
    children,
    icon,
    action,
    ondismiss,
    class: className,
    id,
    dataAttributes,
    ...coreProps
  }: ToastProps = $props();

  const kit = $derived(createToastRecipe(coreProps));
  const mergedClass = $derived(mergeClass(kit.className, className));
</script>

<div
  {id}
  class={mergedClass}
  {...toToastHtmlAttributes(kit.a11y)}
  aria-atomic="true"
  {...kit.dataAttributes}
  {...dataAttributes}
>
  {#if icon}
    <span class="mw-toast__icon" aria-hidden="true">
      {@render icon()}
    </span>
  {/if}
  <div class="mw-toast__body">
    <span class="mw-toast__text">
      {@render children?.()}
    </span>
    {#if action}
      <span class="mw-toast__action">
        {@render action()}
      </span>
    {/if}
  </div>
  {#if ondismiss}
    <button
      type="button"
      class="mw-toast__dismiss"
      aria-label="Dismiss"
      onclick={ondismiss}
    ></button>
  {/if}
</div>
