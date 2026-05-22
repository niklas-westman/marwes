<script lang="ts">
  import { createProgressBarRecipe } from "@marwes-ui/core";
  import { cssVarsToStyle, mergeStyle } from "../../internal/css-vars.js";
  import { mergeClass } from "../../internal/merge-class.js";
  import type { ProgressBarProps } from "./types.js";

  let {
    class: className,
    style,
    dataAttributes,
    ...options
  }: ProgressBarProps = $props();

  const kit = $derived(createProgressBarRecipe(options));
  const mergedClass = $derived(mergeClass(kit.className, className));
  const mergedStyle = $derived(mergeStyle(cssVarsToStyle(kit.vars), style));
  const hasLabelRow = $derived(kit.showLabel || kit.showPercentage);
</script>

<div
  class={mergedClass}
  style={mergedStyle}
  id={kit.a11y.id}
  role={kit.a11y.role}
  aria-valuemin={kit.a11y.ariaValueMin}
  aria-valuemax={kit.a11y.ariaValueMax}
  aria-valuenow={kit.a11y.ariaValueNow}
  aria-valuetext={kit.a11y.ariaValueText}
  aria-label={kit.a11y.ariaLabel}
  aria-labelledby={kit.a11y.ariaLabelledBy}
  aria-describedby={kit.a11y.ariaDescribedBy}
  aria-disabled={kit.a11y.ariaDisabled ? "true" : undefined}
  {...kit.dataAttributes}
  {...dataAttributes}
>
  {#if hasLabelRow}
    <div class="mw-progress-bar__label-row">
      {#if kit.showLabel}
        <span id={kit.labelId} class={kit.labelClassName}>{kit.label}</span>
      {/if}
      {#if kit.showPercentage}
        <span class={kit.percentageClassName}>{kit.percentageLabel}</span>
      {/if}
    </div>
  {/if}

  <div class={kit.trackClassName} aria-hidden="true">
    <span class={kit.fillClassName}></span>
  </div>
</div>
