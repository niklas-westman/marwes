<script lang="ts">
  import { createSliderRecipe, toSliderHtmlAttributes } from "@marwes-ui/core";
  import { cssVarsToStyle, mergeStyle } from "../../internal/css-vars.js";
  import { mergeClass } from "../../internal/merge-class.js";
  import type { SliderProps } from "./types.js";

  let {
    value = $bindable(),
    oninput,
    onvaluechange,
    class: className,
    style,
    ariaDescribedBy,
    ariaInvalid,
    invalid,
    ...options
  }: SliderProps = $props();

  const kit = $derived(createSliderRecipe({
    ...options,
    ...((invalid ?? ariaInvalid) !== undefined ? { invalid: invalid ?? ariaInvalid } : {}),
    ...(value !== undefined ? { value } : {}),
    ...(ariaDescribedBy ? { ariaDescribedBy } : {}),
  }));
  const htmlAttributes = $derived(toSliderHtmlAttributes(kit.a11y));
  const mergedClass = $derived(mergeClass(kit.className, className));
  const mergedStyle = $derived(mergeStyle(cssVarsToStyle(kit.vars), style));

  function handleInput(e: Event & { currentTarget: HTMLInputElement }): void {
    const next = Number(e.currentTarget.value);
    value = next;
    oninput?.(e);
    onvaluechange?.(next);
  }
</script>

<div class={mergedClass} style={mergedStyle} {...kit.dataAttributes}>
  <div class="mw-slider__control">
    <input
      type="range"
      class={kit.inputClassName}
      {...htmlAttributes}
      value={kit.value}
      oninput={handleInput}
    />

    <div class="mw-slider__visual" aria-hidden="true">
      <span class="mw-slider__track"></span>
      <span class="mw-slider__fill"></span>
      <span class="mw-slider__touch-area"></span>
      <span class="mw-slider__thumb"></span>
    </div>

    {#if kit.showTooltip}
      <span class="mw-slider__tooltip" aria-hidden="true">{kit.value}</span>
    {/if}
  </div>
</div>
