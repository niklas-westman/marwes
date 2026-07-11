<script lang="ts">
  import { createTextareaRecipe } from "@marwes-ui/core";
  import { cssVarsToStyle, mergeStyle } from "../../internal/css-vars.js";
  import { mergeClass } from "../../internal/merge-class.js";
  import type { TextareaProps } from "./types.js";

  let {
    value = $bindable(""),
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
  id={kit.a11y.id}
  name={kit.a11y.name}
  inputmode={kit.a11y.inputMode}
  autocomplete={kit.a11y.autoComplete as any}
  placeholder={kit.a11y.placeholder}
  disabled={kit.a11y.disabled}
  readonly={kit.a11y.readOnly}
  required={kit.a11y.required}
  rows={kit.a11y.rows}
  cols={kit.a11y.cols}
  aria-label={kit.a11y.ariaLabel}
  aria-labelledby={kit.a11y.ariaLabelledBy}
  aria-invalid={kit.a11y.ariaInvalid}
  aria-describedby={kit.a11y.ariaDescribedBy}
  {value}
  oninput={handleInput}
></textarea>
