<script lang="ts">
  import { buildRadioGroupFieldA11yIds } from "@marwes-ui/core";
  import { mergeClass } from "../../internal/merge-class.js";
  import type { RadioGroupFieldProps } from "./types.js";

  let {
    id: userProvidedId,
    label,
    description,
    error,
    ariaDescribedBy,
    children,
    class: className,
  }: RadioGroupFieldProps = $props();

  const uniqueId = $props.id();
  const fieldId = $derived(userProvidedId ?? `mw-radio-group-${uniqueId}`);

  function hasTextContent(text: string | undefined): boolean {
    return text !== undefined && text.trim().length > 0;
  }

  const hasDescription = $derived(hasTextContent(description));
  const hasError = $derived(hasTextContent(error));

  const a11yIds = $derived(
    buildRadioGroupFieldA11yIds({
      id: fieldId,
      hasDescription,
      hasError,
      externalDescribedBy: ariaDescribedBy,
    })
  );

  const wrapperClass = $derived(
    mergeClass("mw-radio-group-field", className)
  );
</script>

<fieldset
  class={wrapperClass}
  role="radiogroup"
  aria-labelledby={a11yIds.labelId}
  aria-describedby={a11yIds.describedBy}
  aria-invalid={hasError ? true : undefined}
>
  <legend class="mw-radio-group-field__label" id={a11yIds.labelId}>
    <p class="mw-p mw-p--md">{label}</p>
  </legend>

  <div class="mw-radio-group-field__options">
    {@render children?.()}
  </div>

  {#if hasDescription && !hasError}
    <div class="mw-radio-group-field__description" id={a11yIds.descriptionId}>
      <p class="mw-p mw-p--sm">{description}</p>
    </div>
  {/if}

  {#if hasError}
    <div class="mw-radio-group-field__error" id={a11yIds.errorId} aria-live="polite">
      <p class="mw-p mw-p--sm">{error}</p>
    </div>
  {/if}
</fieldset>
