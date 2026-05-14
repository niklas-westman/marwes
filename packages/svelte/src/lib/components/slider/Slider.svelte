<script lang="ts">
  import { createSliderRecipe } from "@marwes-ui/core";
  import { cssVarsToStyle, mergeStyle } from "../../internal/css-vars.js";
  import { mergeClass } from "../../internal/merge-class.js";
  import type { SliderProps } from "./types.js";

  let {
    value = $bindable(50),
    oninput,
    onvaluechange,
    class: className,
    style,
    ariaDescribedBy,
    ariaInvalid,
    ...options
  }: SliderProps = $props();

  const kit = $derived(createSliderRecipe({
    ...options,
    value,
    ...(ariaDescribedBy ? { ariaDescribedBy } : {}),
  }));
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
      id={kit.a11y.id}
      name={kit.a11y.name}
      min={kit.a11y.min}
      max={kit.a11y.max}
      step={kit.a11y.step}
      disabled={kit.a11y.disabled}
      required={kit.a11y.required}
      aria-label={kit.a11y.ariaLabel}
      aria-labelledby={kit.a11y.ariaLabelledBy}
      aria-describedby={kit.a11y.ariaDescribedBy}
      aria-valuetext={kit.a11y.ariaValueText}
      aria-orientation={kit.a11y.ariaOrientation}
      aria-invalid={ariaInvalid ? true : undefined}
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
