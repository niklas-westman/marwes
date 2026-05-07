<script lang="ts">
  import { buildInputFieldA11yIds } from "@marwes-ui/core";
  import { mergeClass } from "../../internal/merge-class.js";
  import Slider from "./Slider.svelte";
  import type { SliderProps } from "./types.js";

  interface SliderFieldProps {
    id?: string;
    label: string;
    helperText?: string;
    error?: string;
    slider?: Omit<SliderProps, "value">;
    ariaDescribedBy?: string;
    value?: number;
    class?: string;
  }

  let {
    id: userProvidedId,
    label,
    helperText,
    error,
    slider = {},
    ariaDescribedBy,
    value = $bindable(50),
    class: className,
  }: SliderFieldProps = $props();

  const uniqueId = $props.id();
  const fieldId = $derived(userProvidedId ?? `mw-slider-${uniqueId}`);

  function hasTextContent(text: string | undefined): boolean {
    return text !== undefined && text.trim().length > 0;
  }

  const hasHelperText = $derived(hasTextContent(helperText));
  const hasError = $derived(hasTextContent(error));

  const a11yIds = $derived(
    buildInputFieldA11yIds({ id: fieldId, hasHelperText, hasError, externalDescribedBy: ariaDescribedBy })
  );

  const wrapperClass = $derived(mergeClass("mw-slider-field", className));
</script>

<div class={wrapperClass}>
  <label class="mw-slider-field__label" for={fieldId}>
    <p class="mw-p mw-p--md">{label}</p>
  </label>
  <Slider {...slider} id={fieldId} ariaDescribedBy={a11yIds.describedBy || undefined} bind:value />
  {#if hasHelperText && !hasError}
    <div class="mw-slider-field__helper" id={a11yIds.helperTextId}>
      <p class="mw-p mw-p--sm">{helperText}</p>
    </div>
  {/if}
  {#if hasError}
    <div class="mw-slider-field__error" id={a11yIds.errorId} aria-live="polite">
      <p class="mw-p mw-p--sm">{error}</p>
    </div>
  {/if}
</div>
