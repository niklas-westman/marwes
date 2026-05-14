<script lang="ts">
  import { buildSliderFieldA11yIds } from "@marwes-ui/core";
  import { mergeClass } from "../../internal/merge-class.js";
  import Slider from "./Slider.svelte";
  import type { SliderFieldProps, SliderProps } from "./types.js";

  let {
    id: userProvidedId,
    label,
    description,
    helperText,
    error,
    slider = {},
    ariaDescribedBy,
    minValueLabel,
    maxValueLabel,
    labelPosition = "top",
    showEdgeValues = true,
    dataAttributes,
    value = $bindable(50),
    class: className,
  }: SliderFieldProps = $props();

  const uniqueId = $props.id();
  const fieldId = $derived(userProvidedId ?? `mw-slider-${uniqueId}`);

  function hasTextContent(text: string | undefined): boolean {
    return text !== undefined && text.trim().length > 0;
  }

  const descriptionText = $derived(description ?? helperText);
  const hasDescription = $derived(hasTextContent(descriptionText));
  const hasError = $derived(hasTextContent(error));
  const isDisabled = $derived(slider.disabled === true);
  const minEdgeValue = $derived(minValueLabel ?? `${slider.min ?? 0}`);
  const maxEdgeValue = $derived(maxValueLabel ?? `${slider.max ?? 100}`);

  const a11yIds = $derived(
    buildSliderFieldA11yIds({ id: fieldId, hasDescription, hasError, externalDescribedBy: ariaDescribedBy })
  );

  const wrapperClass = $derived(
    mergeClass(
      "mw-slider-field",
      labelPosition === "top" && "mw-slider-field--label-top",
      labelPosition === "inline" && "mw-slider-field--label-inline",
      isDisabled && "mw-slider-field--disabled",
      hasError && "mw-slider-field--invalid",
      className
    )
  );
</script>

<div class={wrapperClass} data-label-position={labelPosition} {...dataAttributes}>
  <div class="mw-slider-field__header">
    <div class="mw-slider-field__label" id={a11yIds.labelId}>
      <p class="mw-p mw-p--md">{label}</p>
    </div>
  </div>

  {#if hasDescription && !hasError}
    <div class="mw-slider-field__description" id={a11yIds.descriptionId}>
      <p class="mw-p mw-p--sm">{descriptionText}</p>
    </div>
  {/if}

  {#if labelPosition === "top" && showEdgeValues}
    <div class="mw-slider-field__values-row">
      <span class="mw-slider-field__edge-value mw-slider-field__edge-value--min">
        <p class="mw-p mw-p--sm">{minEdgeValue}</p>
      </span>
      <span class="mw-slider-field__edge-value mw-slider-field__edge-value--max">
        <p class="mw-p mw-p--sm">{maxEdgeValue}</p>
      </span>
    </div>
  {/if}

  <div class="mw-slider-field__control-row">
    {#if labelPosition === "inline" && showEdgeValues}
      <span class="mw-slider-field__edge-value mw-slider-field__edge-value--min">
        <p class="mw-p mw-p--sm">{minEdgeValue}</p>
      </span>
    {/if}

    <div class="mw-slider-field__slider">
      <Slider
        {...slider}
        id={fieldId}
        ariaLabelledBy={a11yIds.labelId}
        ariaDescribedBy={a11yIds.describedBy || undefined}
        ariaInvalid={hasError}
        style="width: 100%;"
        bind:value
      />
    </div>

    {#if labelPosition === "inline" && showEdgeValues}
      <span class="mw-slider-field__edge-value mw-slider-field__edge-value--max">
        <p class="mw-p mw-p--sm">{maxEdgeValue}</p>
      </span>
    {/if}
  </div>

  {#if hasDescription && hasError}
    <div class="mw-slider-field__description" id={a11yIds.descriptionId}>
      <p class="mw-p mw-p--sm">{descriptionText}</p>
    </div>
  {/if}

  {#if hasError}
    <div class="mw-slider-field__error" id={a11yIds.errorId} aria-live="polite">
      <p class="mw-p mw-p--sm">{error}</p>
    </div>
  {/if}
</div>
