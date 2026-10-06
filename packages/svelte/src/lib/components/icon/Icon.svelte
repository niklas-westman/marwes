<script lang="ts">
  import { createIconRecipe, toIconHtmlAttributes } from "@marwes-ui/core";
  import { cssVarsToStyle } from "../../internal/css-vars.js";
  import { mergeClass } from "../../internal/merge-class.js";
  import { svgAttrsToKebab } from "../../internal/svg-attrs.js";
  import type { IconProps } from "./types.js";

  let {
    name,
    size,
    strokeWidth,
    color,
    class: className,
    // a11y-allow: destructuring rename of the aria-label prop, not an attribute being written
    "aria-label": ariaLabel,
    ariaHidden,
    decorative,
  }: IconProps = $props();

  const kit = $derived(
    createIconRecipe({
      name,
      ...(size !== undefined ? { size } : {}),
      ...(strokeWidth !== undefined ? { strokeWidth } : {}),
      ...(color !== undefined ? { color } : {}),
      ...(ariaLabel !== undefined ? { ariaLabel } : {}),
      ...(ariaHidden !== undefined ? { ariaHidden } : {}),
      ...(decorative !== undefined ? { decorative } : {}),
    })
  );
  const mergedClass = $derived(mergeClass(kit.className, className));
</script>

<svg
  width={kit.svg.width}
  height={kit.svg.height}
  viewBox={kit.svg.viewBox}
  fill="none"
  stroke="currentColor"
  stroke-width={kit.vars["--mw-icon-stroke-width"]}
  stroke-linecap="round"
  stroke-linejoin="round"
  class={mergedClass}
  style={cssVarsToStyle(kit.vars)}
  {...toIconHtmlAttributes(kit.a11y)}
  focusable="false"
>
  {#each kit.svg.nodes as node}
    {#if node.tag === "path"}
      <path {...svgAttrsToKebab(node.attrs)} />
    {:else if node.tag === "circle"}
      <circle {...svgAttrsToKebab(node.attrs)} />
    {:else if node.tag === "line"}
      <line {...svgAttrsToKebab(node.attrs)} />
    {:else if node.tag === "polygon"}
      <polygon {...svgAttrsToKebab(node.attrs)} />
    {:else if node.tag === "polyline"}
      <polyline {...svgAttrsToKebab(node.attrs)} />
    {:else if node.tag === "rect"}
      <rect {...svgAttrsToKebab(node.attrs)} />
    {:else if node.tag === "ellipse"}
      <ellipse {...svgAttrsToKebab(node.attrs)} />
    {/if}
  {/each}
</svg>
