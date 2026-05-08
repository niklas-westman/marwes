<script lang="ts">
  import { createSkeletonRecipe } from "@marwes-ui/core";
  import { cssVarsToStyle, mergeStyle } from "../../internal/css-vars.js";
  import { mergeClass } from "../../internal/merge-class.js";
  import type { SkeletonProps } from "./types.js";

  let {
    class: className,
    style,
    dataAttributes,
    ...options
  }: SkeletonProps = $props();

  const kit = $derived(createSkeletonRecipe(options));
  const mergedClass = $derived(mergeClass(kit.className, className));
  const mergedStyle = $derived(mergeStyle(cssVarsToStyle(kit.vars), style));
</script>

<span
  class={mergedClass}
  style={mergedStyle}
  id={kit.a11y.id}
  role={kit.a11y.role}
  aria-hidden={kit.a11y.ariaHidden ? "true" : undefined}
  aria-label={kit.a11y.ariaLabel}
  aria-live={kit.a11y.ariaLive}
  {...kit.dataAttributes}
  {...dataAttributes}
></span>
