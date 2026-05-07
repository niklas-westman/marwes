<script lang="ts">
  import { buildCheckboxFieldA11yIds } from "@marwes-ui/core";
  import { mergeClass } from "../../internal/merge-class.js";
  import Checkbox from "./Checkbox.svelte";
  import type { CheckboxProps } from "./types.js";

  interface CheckboxFieldProps {
    id?: string;
    label: string;
    description?: string;
    error?: string;
    checkbox?: CheckboxProps;
    ariaDescribedBy?: string;
    checked?: boolean;
    class?: string;
  }

  let {
    id: userProvidedId,
    label,
    description,
    error,
    checkbox = {},
    ariaDescribedBy,
    checked = $bindable(false),
    class: className,
  }: CheckboxFieldProps = $props();

  const uniqueId = $props.id();
  const fieldId = $derived(userProvidedId ?? `mw-checkbox-${uniqueId}`);

  function hasTextContent(text: string | undefined): boolean {
    return text !== undefined && text.trim().length > 0;
  }

  const hasDescription = $derived(hasTextContent(description));
  const hasError = $derived(hasTextContent(error));
  const invalid = $derived(hasError || checkbox.invalid || false);
  const disabled = $derived(checkbox.disabled || false);

  const a11yIds = $derived(
    buildCheckboxFieldA11yIds({
      id: fieldId,
      hasDescription,
      hasError,
      externalDescribedBy: ariaDescribedBy,
    })
  );

  const wrapperClass = $derived(
    mergeClass(
      "mw-checkbox-field",
      disabled && "mw-checkbox-field--disabled",
      invalid && "mw-checkbox-field--invalid",
      className
    )
  );
</script>

<div class={wrapperClass}>
  <div class="mw-checkbox-field__row">
    <Checkbox
      {...checkbox}
      id={fieldId}
      {invalid}
      ariaDescribedBy={a11yIds.describedBy ?? undefined}
      bind:checked
    />
    <label class="mw-checkbox-field__label" for={fieldId}>
      <p class="mw-p mw-p--md">{label}</p>
    </label>
  </div>

  {#if hasDescription}
    <div class="mw-checkbox-field__description" id={a11yIds.descriptionId}>
      <p class="mw-p mw-p--sm">{description}</p>
    </div>
  {/if}

  {#if hasError}
    <div class="mw-checkbox-field__error" id={a11yIds.errorId} aria-live="polite">
      <p class="mw-p mw-p--sm">{error}</p>
    </div>
  {/if}
</div>
