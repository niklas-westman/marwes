<script lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements";
  import { createInputRecipe, toInputHtmlAttributes } from "@marwes-ui/core";
  import { cssVarsToStyle, mergeStyle } from "../../internal/css-vars.js";
  import { mergeClass } from "../../internal/merge-class.js";
  import type { InputProps } from "./types.js";

  let {
    defaultValue,
    value = $bindable(defaultValue ?? ""),
    oninput,
    class: className,
    style,
    describedBy,
    ...options
  }: InputProps = $props();

  const kit = $derived(
    createInputRecipe({
      ...options,
      value,
      ...(describedBy ? { describedBy } : {}),
    })
  );
  const htmlAttributes = $derived(toInputHtmlAttributes(kit.a11y));
  const mergedClass = $derived(mergeClass(kit.className, className));
  const mergedStyle = $derived(mergeStyle(cssVarsToStyle(kit.vars), style));

  function handleInput(e: Event & { currentTarget: HTMLInputElement }): void {
    value = e.currentTarget.value;
    oninput?.(e);
  }
</script>

<input
  class={mergedClass}
  style={mergedStyle}
  {...htmlAttributes}
  autocomplete={htmlAttributes.autocomplete as HTMLInputAttributes["autocomplete"]}
  {value}
  oninput={handleInput}
/>
