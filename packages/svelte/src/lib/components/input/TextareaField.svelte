<script lang="ts">
  import { buildInputFieldA11yIds } from "@marwes-ui/core";
  import { mergeClass } from "../../internal/merge-class.js";
  import Text from "../text/Text.svelte";
  import Textarea from "./Textarea.svelte";
  import type { TextareaFieldProps, TextareaProps } from "./types.js";

  let {
    id: userProvidedId,
    label,
    helperText,
    counterText,
    error,
    textarea = {},
    ariaDescribedBy,
    value = $bindable(""),
    class: className,
  }: TextareaFieldProps = $props();

  const uniqueId = $props.id();
  const fieldId = $derived(userProvidedId ?? `mw-textarea-${uniqueId}`);

  function hasTextContent(text: string | undefined): boolean {
    return text !== undefined && text.trim().length > 0;
  }

  const hasHelperText = $derived(hasTextContent(helperText));
  const hasCounterText = $derived(hasTextContent(counterText));
  const hasError = $derived(hasTextContent(error));
  const invalid = $derived(hasError || textarea.invalid || false);
  const disabled = $derived(textarea.disabled || false);
  const readOnly = $derived(textarea.readOnly || false);

  const a11yIds = $derived(
    buildInputFieldA11yIds({ id: fieldId, hasHelperText, hasError, externalDescribedBy: ariaDescribedBy })
  );

  const wrapperClass = $derived(
    mergeClass("mw-input-field", "mw-input-field--textarea", disabled && "mw-input-field--disabled", invalid && "mw-input-field--invalid", readOnly && "mw-input-field--readonly", className)
  );
</script>

<div class={wrapperClass}>
  <label class="mw-input-field__label" for={fieldId}>
    <Text variant="label">{label}</Text>
  </label>
  <div class="mw-input-field__input-wrapper">
    <Textarea {...textarea} id={fieldId} {invalid} describedBy={a11yIds.describedBy ?? undefined} bind:value />
  </div>
  {#if (hasHelperText || hasCounterText) && !hasError}
    <div class="mw-input-field__meta">
      {#if hasHelperText}
        <div class="mw-input-field__helper" id={a11yIds.helperTextId}>
          <Text variant="caption">{helperText}</Text>
        </div>
      {:else}
        <span aria-hidden="true"></span>
      {/if}

      {#if hasCounterText}
        <div class="mw-input-field__counter">
          <Text variant="caption">{counterText}</Text>
        </div>
      {/if}
    </div>
  {/if}
  {#if hasError}
    <div class="mw-input-field__error" id={a11yIds.errorId} aria-live="polite">
      <Text variant="caption">{error}</Text>
    </div>
  {/if}
</div>
