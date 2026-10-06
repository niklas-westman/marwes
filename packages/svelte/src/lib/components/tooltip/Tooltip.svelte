<script lang="ts">
  import { createTooltipRecipe, toTooltipHtmlAttributes } from "@marwes-ui/core";
  import { cssVarsToStyle, mergeStyle } from "../../internal/css-vars.js";
  import { mergeClass } from "../../internal/merge-class.js";
  import type { TooltipProps } from "./types.js";

  let {
    children,
    class: className,
    style,
    dataAttributes,
    ...options
  }: TooltipProps = $props();

  const kit = $derived(createTooltipRecipe(options));
  const mergedClass = $derived(mergeClass(kit.className, className));
  const mergedStyle = $derived(mergeStyle(cssVarsToStyle(kit.vars), style));
</script>

<span
  class={mergedClass}
  style={mergedStyle}
  {...toTooltipHtmlAttributes(kit.a11y)}
  {...kit.dataAttributes}
  {...dataAttributes}
>
  {@render children?.()}
</span>
