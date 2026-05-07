<script lang="ts">
  import {
    iconRegistry,
    resolveIconA11y,
    resolveIconSize,
    resolveIconStrokeWidth,
  } from "@marwes-ui/core";
  import { svgAttrsToKebab } from "../../internal/svg-attrs.js";
  import type { IconProps } from "./types.js";

  let {
    name,
    size,
    strokeWidth,
    class: className,
    "aria-label": ariaLabel,
    decorative,
  }: IconProps = $props();

  const px = $derived(resolveIconSize(size ?? "sm"));
  const sw = $derived(resolveIconStrokeWidth(strokeWidth ?? "md"));
  const def = $derived(iconRegistry[name]);
  const a11y = $derived(
    resolveIconA11y({
      ...(ariaLabel !== undefined ? { ariaLabel } : {}),
      ...(decorative !== undefined ? { decorative } : {}),
    })
  );
</script>

{#if def}
  <svg
    width={px}
    height={px}
    viewBox={def.viewBox}
    fill="none"
    stroke="currentColor"
    stroke-width={sw}
    stroke-linecap="round"
    stroke-linejoin="round"
    class={className}
    aria-hidden={a11y.ariaHidden ? "true" : undefined}
    aria-label={a11y.ariaLabel}
    role={a11y.role}
    focusable="false"
  >
    {#each def.nodes as node}
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
{/if}
