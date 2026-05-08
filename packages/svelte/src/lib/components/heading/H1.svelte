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
