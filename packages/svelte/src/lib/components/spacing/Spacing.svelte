<script lang="ts">
  import { createSpacingRecipe } from "@marwes-ui/core";
  import { cssVarsToStyle, mergeStyle } from "../../internal/css-vars.js";
  import { mergeClass } from "../../internal/merge-class.js";
  import type { SpacingProps } from "./types.js";

  let {
    class: className,
    style,
    ...options
  }: SpacingProps = $props();

  const kit = $derived(createSpacingRecipe(options));
  const mergedClass = $derived(mergeClass(kit.className, className));
  const mergedStyle = $derived(mergeStyle(cssVarsToStyle(kit.vars), style));
</script>

<div
  class={mergedClass}
  style={mergedStyle}
  aria-hidden={kit.a11y["aria-hidden"]}
  data-component={kit.dataAttributes["data-component"]}
  data-size={kit.dataAttributes["data-size"]}
></div>
