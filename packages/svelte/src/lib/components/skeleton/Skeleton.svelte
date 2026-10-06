<script lang="ts">
  import { createSkeletonRecipe, toSkeletonHtmlAttributes } from "@marwes-ui/core";
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
  {...toSkeletonHtmlAttributes(kit.a11y)}
  {...kit.dataAttributes}
  {...dataAttributes}
></span>
