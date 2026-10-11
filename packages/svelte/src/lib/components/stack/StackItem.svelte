<script lang="ts">
  import { createStackItemRecipe } from "@marwes-ui/core";
  import { cssVarsToStyle, mergeStyle } from "../../internal/css-vars.js";
  import { mergeClass } from "../../internal/merge-class.js";
  import type { StackItemProps } from "./types.js";

  let {
    as,
    horizontalSizing,
    verticalSizing,
    children,
    class: className,
    style,
    ...nativeProps
  }: StackItemProps = $props();

  const kit = $derived(
    createStackItemRecipe({
      ...(as !== undefined ? { as } : {}),
      ...(horizontalSizing !== undefined ? { horizontalSizing } : {}),
      ...(verticalSizing !== undefined ? { verticalSizing } : {}),
    })
  );
  const mergedClass = $derived(mergeClass(kit.className, className));
  const mergedStyle = $derived(mergeStyle(style, cssVarsToStyle(kit.vars)));
</script>

<svelte:element
  this={kit.tag}
  {...nativeProps}
  {...kit.dataAttributes}
  class={mergedClass}
  style={mergedStyle}
>
  {@render children?.()}
</svelte:element>
