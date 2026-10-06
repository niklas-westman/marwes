<script lang="ts">
  import { createDividerRecipe, toDividerHtmlAttributes } from "@marwes-ui/core";
  import { cssVarsToStyle, mergeStyle } from "../../internal/css-vars.js";
  import { mergeClass } from "../../internal/merge-class.js";
  import type { DividerProps } from "./types.js";

  let {
    class: className,
    style,
    size,
    orientation,
    id,
    ...nativeProps
  }: DividerProps = $props();

  const kit = $derived(
    createDividerRecipe({
      ...(size !== undefined ? { size } : {}),
      ...(orientation !== undefined ? { orientation } : {}),
      ...(id !== undefined ? { id } : {}),
    })
  );
  const mergedClass = $derived(mergeClass(kit.className, className));
  const mergedStyle = $derived(mergeStyle(cssVarsToStyle(kit.vars), style));
</script>

<hr
  {...nativeProps}
  class={mergedClass}
  style={mergedStyle}
  {...toDividerHtmlAttributes(kit.a11y)}
  {...kit.dataAttributes}
/>
