<script lang="ts">
  import { createStatTileRecipe } from "@marwes-ui/core";
  import { mergeClass } from "../../internal/merge-class.js";
  import type { StatTileProps } from "./types.js";

  let {
    label,
    value,
    subtitle,
    trendValue,
    class: className,
    ...options
  }: StatTileProps = $props();

  const kit = $derived(createStatTileRecipe({
    ...options,
    ...(trendValue ? { trendValue } : {}),
  }));
  const mergedClass = $derived(mergeClass(kit.className, className));
</script>

<article class={mergedClass} {...kit.dataAttributes}>
  <div class={kit.slots.headerClassName}>
    <span class={kit.slots.labelClassName}>{label}</span>
    {#if kit.trendIcon && trendValue}
      <span
        class={kit.slots.trendClassName}
        aria-label={kit.a11y.trendAriaLabel}
        {...kit.trendDataAttributes}
      >
        <span class={kit.slots.trendIconClassName} aria-hidden="true">{kit.trendIcon}</span>
        <span class={kit.slots.trendValueClassName}>{trendValue}</span>
      </span>
    {/if}
  </div>
  <span class={kit.slots.valueClassName}>{value}</span>
  {#if subtitle}
    <span class={kit.slots.subtitleClassName}>{subtitle}</span>
  {/if}
</article>
