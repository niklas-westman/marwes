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
    required,
    disabled,
    dataAttributes,
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
    mergeClass(
      "mw-radio-group-field",
      disabled && "mw-radio-group-field--disabled",
      hasError && "mw-radio-group-field--invalid",
      className
    )
  );
</script>

<div class={wrapperClass} {...dataAttributes}>
  <div class="mw-radio-group-field__label" id={a11yIds.labelId}>
    <p class="mw-p mw-p--sm">{label}</p>
  </div>

  {#if hasDescription}
    <div class="mw-radio-group-field__description" id={a11yIds.descriptionId}>
      <p class="mw-p mw-p--sm">{description}</p>
    </div>
  {/if}

  <div
    role="radiogroup"
    aria-labelledby={a11yIds.labelId}
    aria-describedby={a11yIds.describedBy}
    aria-invalid={hasError ? true : undefined}
    aria-required={required ? true : undefined}
    class="mw-radio-group-field__options"
  >
    {@render children?.()}
  </div>

  {#if hasError}
    <div class="mw-radio-group-field__error" id={a11yIds.errorId} aria-live="polite">
      <p class="mw-p mw-p--sm">{error}</p>
    </div>
  {/if}
</div>
