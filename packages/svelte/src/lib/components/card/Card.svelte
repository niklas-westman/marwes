<script lang="ts">
  import { createCardRecipe } from "@marwes-ui/core";
  import { mergeClass } from "../../internal/merge-class.js";
  import type { CardProps } from "./types.js";

  let {
    title,
    children,
    class: className,
    id,
    ariaDisabled,
    dataAttributes,
  }: CardProps = $props();

  const kit = $derived(createCardRecipe(dataAttributes ? { dataAttributes } : {}));
  const mergedClass = $derived(mergeClass(kit.className, className));
</script>

<div {id} class={mergedClass} aria-disabled={ariaDisabled} {...kit.dataAttributes}>
  {#if title}
    <div class="mw-card__header">
      <span class="mw-card__title">
        {#if typeof title === "string"}
          {title}
        {:else}
          {@render title()}
        {/if}
      </span>
    </div>
  {/if}
  <div class="mw-card__body">
    {@render children?.()}
  </div>
</div>
