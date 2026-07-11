<script lang="ts">
  import { textRecipe } from "@marwes-ui/core";
  import { cssVarsToStyle, mergeStyle } from "../../internal/css-vars.js";
  import { mergeClass } from "../../internal/merge-class.js";
  import { useTheme } from "../../provider/use-theme.js";
  import type { TextProps } from "./types.js";

  let {
    children,
    class: className,
    style,
    ...opts
  }: TextProps = $props();

  const { theme } = useTheme();
  const kit = $derived(textRecipe(opts, theme));
  const mergedClass = $derived(mergeClass(kit.className, className));
  const mergedStyle = $derived(mergeStyle(cssVarsToStyle(kit.vars), style));
</script>

<svelte:element this={kit.tag} id={kit.a11y.id} class={mergedClass} style={mergedStyle}>
  {@render children?.()}
</svelte:element>
