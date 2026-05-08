<script lang="ts">
  import { createSpinnerRecipe } from "@marwes-ui/core";
  import { cssVarsToStyle, mergeStyle } from "../../internal/css-vars.js";
  import { mergeClass } from "../../internal/merge-class.js";
  import { svgAttrsToKebab } from "../../internal/svg-attrs.js";
  import type { SpinnerProps } from "./types.js";

  let {
    variant,
    size,
    decorative,
    ariaLabel,
    id,
    class: className,
    style,
  }: SpinnerProps = $props();

  const kit = $derived(
    createSpinnerRecipe({
      ...(variant !== undefined ? { variant } : {}),
      ...(size !== undefined ? { size } : {}),
      ...(decorative !== undefined ? { decorative } : {}),
      ...(ariaLabel !== undefined ? { ariaLabel } : {}),
      ...(id !== undefined ? { id } : {}),
    })
  );

  const mergedClass = $derived(mergeClass(kit.className, className));
  const mergedStyle = $derived(mergeStyle(cssVarsToStyle(kit.vars), style));
</script>

<span
  class={mergedClass}
  style={mergedStyle}
  role={kit.a11y.role}
  id={kit.a11y.id}
  aria-hidden={kit.a11y.ariaHidden ? "true" : undefined}
  aria-label={kit.a11y.ariaLabel}
  aria-live={kit.a11y.ariaLive}
  {...kit.dataAttributes}
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
