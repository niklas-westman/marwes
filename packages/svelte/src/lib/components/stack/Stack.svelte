<script lang="ts">
  import { createStackRecipe } from "@marwes-ui/core";
  import { cssVarsToStyle, mergeStyle } from "../../internal/css-vars.js";
  import { mergeClass } from "../../internal/merge-class.js";
  import type { StackProps } from "./types.js";

  let {
    direction,
    gap,
    rowGap,
    columnGap,
    padding,
    paddingX,
    paddingY,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
    alignItems,
    justifyContent,
    wrap,
    as,
    horizontalSizing,
    verticalSizing,
    children,
    class: className,
    style,
    ...nativeProps
  }: StackProps = $props();

  const kit = $derived(
    createStackRecipe({
      ...(direction !== undefined ? { direction } : {}),
      ...(gap !== undefined ? { gap } : {}),
      ...(rowGap !== undefined ? { rowGap } : {}),
      ...(columnGap !== undefined ? { columnGap } : {}),
      ...(padding !== undefined ? { padding } : {}),
      ...(paddingX !== undefined ? { paddingX } : {}),
      ...(paddingY !== undefined ? { paddingY } : {}),
      ...(paddingTop !== undefined ? { paddingTop } : {}),
      ...(paddingRight !== undefined ? { paddingRight } : {}),
      ...(paddingBottom !== undefined ? { paddingBottom } : {}),
      ...(paddingLeft !== undefined ? { paddingLeft } : {}),
      ...(alignItems !== undefined ? { alignItems } : {}),
      ...(justifyContent !== undefined ? { justifyContent } : {}),
      ...(wrap !== undefined ? { wrap } : {}),
      ...(as !== undefined ? { as } : {}),
      ...(horizontalSizing !== undefined ? { horizontalSizing } : {}),
      ...(verticalSizing !== undefined ? { verticalSizing } : {}),
    })
  );
  const mergedClass = $derived(mergeClass(kit.className, className));
  // Kit vars come last so the token-backed --mw-stack-* vars cannot be overridden.
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
