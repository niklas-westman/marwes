<script lang="ts">
  import { createStatTileRecipe } from "@marwes-ui/core";
  import { mergeClass } from "../../internal/merge-class.js";
  import type { StatTileProps } from "./types.js";

  let {
    label,
    value,
    subtitle,
    trendValue,
    dataAttributes,
    class: className,
    ...options
  }: StatTileProps = $props();

  const kit = $derived(createStatTileRecipe({
    ...options,
    ...(trendValue ? { trendValue } : {}),
    ...(dataAttributes ? { dataAttributes } : {}),
  }));
  const mergedClass = $derived(mergeClass(kit.className, className));
</script>

<article class={mergedClass} {...kit.dataAttributes}>
  <div class={kit.slots.headerClassName}>
    <span class={kit.slots.labelClassName}>{label}</span>
    {#if trendValue}
      <span
        class={kit.slots.trendClassName}
        aria-label={kit.a11y.trendAriaLabel}
        {...kit.trendDataAttributes}
      >
        {#if kit.trendIcon}
          <span class={kit.slots.trendIconClassName} aria-hidden="true">{kit.trendIcon}</span>
        {/if}
        <span class={kit.slots.trendValueClassName}>{trendValue}</span>
      </span>
    {/if}
  </div>
  <div class={kit.slots.valueClassName}>{value}</div>
  {#if subtitle}
    <div class={kit.slots.subtitleClassName}>{subtitle}</div>
  {/if}
</article>
