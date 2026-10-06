<script lang="ts">
  import {
    buildCheckboxGroupFieldA11yIds,
    resolveCheckboxGroupFieldA11y,
    toCheckboxGroupFieldHtmlAttributes,
  } from "@marwes-ui/core";
  import { mergeClass } from "../../internal/merge-class.js";
  import Text from "../text/Text.svelte";
  import type { CheckboxGroupFieldProps } from "./types.js";

  let {
    id: userProvidedId,
    label,
    description,
    error,
    ariaDescribedBy,
    required,
    disabled,
    children,
    class: className,
  }: CheckboxGroupFieldProps = $props();

  const uniqueId = $props.id();
  const fieldId = $derived(userProvidedId ?? `mw-checkbox-group-${uniqueId}`);

  function hasTextContent(text: string | undefined): boolean {
    return text !== undefined && text.trim().length > 0;
  }

  const hasDescription = $derived(hasTextContent(description));
  const hasError = $derived(hasTextContent(error));

  const a11yIds = $derived(
    buildCheckboxGroupFieldA11yIds({
      id: fieldId,
      hasDescription,
      hasError,
      externalDescribedBy: ariaDescribedBy,
    })
  );

  const wrapperClass = $derived(
    mergeClass("mw-checkbox-group-field", disabled && "mw-checkbox-group-field--disabled", hasError && "mw-checkbox-group-field--invalid", className)
  );
</script>

<!-- svelte-ignore a11y_role_supports_aria_props_implicit -->
<fieldset
  class={wrapperClass}
  {...toCheckboxGroupFieldHtmlAttributes(
    resolveCheckboxGroupFieldA11y({ labelId: a11yIds.labelId, describedBy: a11yIds.describedBy, invalid: hasError, required })
  )}
  disabled={disabled ? true : undefined}
>
  <legend class="mw-checkbox-group-field__label" id={a11yIds.labelId}>
    <Text variant="label">{label}</Text>
  </legend>
  {#if hasDescription}
    <div class="mw-checkbox-group-field__description" id={a11yIds.descriptionId}>
      <Text variant="caption">{description}</Text>
    </div>
  {/if}
  <div class="mw-checkbox-group-field__options">
    {@render children?.()}
  </div>
  {#if hasError}
    <div class="mw-checkbox-group-field__error" id={a11yIds.errorId} aria-live="polite">
      <Text variant="caption">{error}</Text>
    </div>
  {/if}
</fieldset>
