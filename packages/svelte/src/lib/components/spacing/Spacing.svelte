<script lang="ts">
  import { createSpacingRecipe, toSpacingHtmlAttributes } from "@marwes-ui/core";
  import { cssVarsToStyle, mergeStyle } from "../../internal/css-vars.js";
  import { mergeClass } from "../../internal/merge-class.js";
  import type { SpacingProps } from "./types.js";

  let {
    class: className,
    style,
    size,
    scale,
    ...nativeProps
  }: SpacingProps = $props();

  const kit = $derived(
    createSpacingRecipe({
      ...(size !== undefined ? { size } : {}),
      ...(scale !== undefined ? { scale } : {}),
    })
  );
  const mergedClass = $derived(mergeClass(kit.className, className));
  const mergedStyle = $derived(mergeStyle(cssVarsToStyle(kit.vars), style));
</script>

<div
  {...nativeProps}
  class={mergedClass}
  style={mergedStyle}
  {...toSpacingHtmlAttributes(kit.a11y)}
  {...kit.dataAttributes}
></div>
