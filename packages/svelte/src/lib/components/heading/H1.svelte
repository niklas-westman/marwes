<!--
  H1 (Heading Level 1) — semantic top-level heading rendered as `<h1>`.

  @remarks
  Marwes officially styles H1-H3 only. For semantic H4-H6 (deep section
  nesting, accessibility outlines), render
  `<Text headingLevel={4} variant="..." />` — it produces the correct
  heading tag while letting the consumer pick the visual variant.
  Type your wrappers against `SemanticHeadingLevel` from `@marwes-ui/core`.
-->
<script lang="ts">
  import { headingRecipe } from "@marwes-ui/core";
  import { cssVarsToStyle, mergeStyle } from "../../internal/css-vars.js";
  import { mergeClass } from "../../internal/merge-class.js";
  import { useTheme } from "../../provider/use-theme.js";
  import type { H1Props } from "./types.js";

  let {
    children,
    class: className,
    style,
    ...opts
  }: H1Props = $props();

  const { theme } = useTheme();
  const kit = $derived(headingRecipe({ ...opts, level: 1 }, theme));
  const mergedClass = $derived(mergeClass(kit.className, className));
  const mergedStyle = $derived(mergeStyle(cssVarsToStyle(kit.vars), style));
</script>

<h1 id={kit.a11y.id} aria-label={kit.a11y.ariaLabel} class={mergedClass} style={mergedStyle}>
  {@render children?.()}
</h1>
