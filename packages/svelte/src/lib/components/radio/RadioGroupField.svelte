<script lang="ts">
  import {
    buildRadioGroupFieldA11yIds,
    resolveRadioGroupFieldA11y,
    toRadioGroupFieldHtmlAttributes,
  } from "@marwes-ui/core";
  import { mergeClass } from "../../internal/merge-class.js";
  import Text from "../text/Text.svelte";
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
    <Text variant="label">{label}</Text>
  </div>

  {#if hasDescription}
    <div class="mw-radio-group-field__description" id={a11yIds.descriptionId}>
      <Text variant="caption">{description}</Text>
    </div>
  {/if}

  <div
    {...toRadioGroupFieldHtmlAttributes(
      resolveRadioGroupFieldA11y({ labelId: a11yIds.labelId, describedBy: a11yIds.describedBy, invalid: hasError, required })
    )}
    class="mw-radio-group-field__options"
  >
    {@render children?.()}
  </div>

  {#if hasError}
    <div class="mw-radio-group-field__error" id={a11yIds.errorId} aria-live="polite">
      <Text variant="caption">{error}</Text>
    </div>
  {/if}
</div>
