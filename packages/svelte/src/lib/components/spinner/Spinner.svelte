<script lang="ts">
  import { createSpinnerRecipe, toSpinnerHtmlAttributes } from "@marwes-ui/core";
  import { cssVarsToStyle, mergeStyle } from "../../internal/css-vars.js";
  import { mergeClass } from "../../internal/merge-class.js";
  import { svgAttrsToKebab } from "../../internal/svg-attrs.js";
  import type { SpinnerProps } from "./types.js";

  let {
    variant,
    size,
    decorative,
    ariaLabel,
    label,
    id,
    class: className,
    style,
    dataAttributes,
  }: SpinnerProps = $props();

  const kit = $derived(
    createSpinnerRecipe({
      ...(variant !== undefined ? { variant } : {}),
      ...(size !== undefined ? { size } : {}),
      ...(decorative !== undefined ? { decorative } : {}),
      ...(ariaLabel !== undefined ? { ariaLabel } : {}),
      ...(label !== undefined ? { label } : {}),
      ...(id !== undefined ? { id } : {}),
    })
  );

  const mergedClass = $derived(mergeClass(kit.className, className));
  const mergedStyle = $derived(mergeStyle(cssVarsToStyle(kit.vars), style));
</script>

<span
  class={mergedClass}
  style={mergedStyle}
  {...toSpinnerHtmlAttributes(kit.a11y)}
  {...kit.dataAttributes}
  {...dataAttributes}
>
  <svg
    class="mw-spinner__svg"
    viewBox={kit.svg.viewBox}
    aria-hidden="true"
    focusable="false"
  >
    {#each kit.svg.nodes as node}
      {#if node.tag === "circle"}
        <circle {...svgAttrsToKebab(node.attrs)} />
      {:else if node.tag === "path"}
        <path {...svgAttrsToKebab(node.attrs)} />
      {:else if node.tag === "rect"}
        <rect {...svgAttrsToKebab(node.attrs)} />
      {/if}
    {/each}
  </svg>
</span>
