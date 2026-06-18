<!--
  H2 (Heading Level 2) — semantic section heading rendered as `<h2>`.

  @remarks
  For semantic H4-H6, use `<Text headingLevel={4..6} variant="..." />`.
-->
<script lang="ts">
  import { headingRecipe } from "@marwes-ui/core";
  import { cssVarsToStyle, mergeStyle } from "../../internal/css-vars.js";
  import { mergeClass } from "../../internal/merge-class.js";
  import { useTheme } from "../../provider/use-theme.js";
  import type { H2Props } from "./types.js";

  let {
    children,
    class: className,
    style,
    ...opts
  }: H2Props = $props();

  const { theme } = useTheme();
  const kit = $derived(headingRecipe({ ...opts, level: 2 }, theme));
  const mergedClass = $derived(mergeClass(kit.className, className));
  const mergedStyle = $derived(mergeStyle(cssVarsToStyle(kit.vars), style));
</script>

<h2 id={kit.a11y.id} aria-label={kit.a11y.ariaLabel} class={mergedClass} style={mergedStyle}>
  {@render children?.()}
</h2>
