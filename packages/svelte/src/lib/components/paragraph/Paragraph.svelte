<script lang="ts">
  import { paragraphRecipe, toParagraphHtmlAttributes } from "@marwes-ui/core";
  import { cssVarsToStyle, mergeStyle } from "../../internal/css-vars.js";
  import { mergeClass } from "../../internal/merge-class.js";
  import { useTheme } from "../../provider/use-theme.js";
  import type { ParagraphProps } from "./types.js";

  let {
    children,
    class: className,
    style,
    ...opts
  }: ParagraphProps = $props();

  const { theme } = useTheme();
  const kit = $derived(paragraphRecipe(opts, theme));
  const mergedClass = $derived(mergeClass(kit.className, className));
  const mergedStyle = $derived(mergeStyle(cssVarsToStyle(kit.vars), style));
</script>

<p {...toParagraphHtmlAttributes(kit.a11y)} class={mergedClass} style={mergedStyle}>
  {@render children?.()}
</p>
