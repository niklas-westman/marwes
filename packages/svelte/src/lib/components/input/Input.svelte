<script lang="ts">
  import { createInputRecipe } from "@marwes-ui/core";
  import { cssVarsToStyle, mergeStyle } from "../../internal/css-vars.js";
  import { mergeClass } from "../../internal/merge-class.js";
  import type { InputProps } from "./types.js";

  let {
    value = $bindable(""),
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
  id={kit.a11y.id}
  name={kit.a11y.name}
  type={kit.a11y.type}
  inputmode={kit.a11y.inputMode}
  autocomplete={kit.a11y.autoComplete as any}
  placeholder={kit.a11y.placeholder}
  disabled={kit.a11y.disabled}
  readonly={kit.a11y.readOnly}
  required={kit.a11y.required}
  aria-label={kit.a11y.ariaLabel}
  aria-labelledby={kit.a11y.ariaLabelledBy}
  aria-invalid={kit.a11y.ariaInvalid}
  aria-describedby={kit.a11y.ariaDescribedBy}
  {value}
  oninput={handleInput}
/>
