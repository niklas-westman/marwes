<script lang="ts">
  import { createTextareaRecipe, toTextareaHtmlAttributes } from "@marwes-ui/core";
  import { cssVarsToStyle, mergeStyle } from "../../internal/css-vars.js";
  import { mergeClass } from "../../internal/merge-class.js";
  import type { TextareaProps } from "./types.js";

  let {
    defaultValue,
    value = $bindable(defaultValue ?? ""),
    oninput,
    class: className,
    style,
    describedBy,
    ...options
  }: TextareaProps = $props();

  const kit = $derived(
    createTextareaRecipe({
      ...options,
      value,
      ...(describedBy ? { describedBy } : {}),
    })
  );
  const htmlAttributes = $derived(toTextareaHtmlAttributes(kit.a11y));
  const mergedClass = $derived(mergeClass(kit.className, className));
  const mergedStyle = $derived(mergeStyle(cssVarsToStyle(kit.vars), style));

  function handleInput(e: Event & { currentTarget: HTMLTextAreaElement }): void {
    value = e.currentTarget.value;
    oninput?.(e);
  }
</script>

<textarea
  class={mergedClass}
  style={mergedStyle}
  {...htmlAttributes}
  {value}
  oninput={handleInput}
></textarea>
