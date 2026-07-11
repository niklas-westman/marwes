<!--
  H3 (Heading Level 3) — semantic subsection heading rendered as `<h3>`.

  @remarks
  H3 is the deepest blessed rung. For H4-H6, use
  `<Text headingLevel={4..6} variant="..." />`.
-->
<script lang="ts">
  import { headingRecipe } from "@marwes-ui/core";
  import { cssVarsToStyle, mergeStyle } from "../../internal/css-vars.js";
  import { mergeClass } from "../../internal/merge-class.js";
  import { useTheme } from "../../provider/use-theme.js";
  import type { H3Props } from "./types.js";

  let {
    children,
    class: className,
    style,
    ...opts
  }: H3Props = $props();

  const { theme } = useTheme();
  const kit = $derived(headingRecipe({ ...opts, level: 3 }, theme));
  const mergedClass = $derived(mergeClass(kit.className, className));
  const mergedStyle = $derived(mergeStyle(cssVarsToStyle(kit.vars), style));
</script>

<h3 id={kit.a11y.id} aria-label={kit.a11y.ariaLabel} class={mergedClass} style={mergedStyle}>
  {@render children?.()}
</h3>
