<script lang="ts">
  import { buildRichTextFieldA11yIds } from "@marwes-ui/core";
  import type { RichTextOptions } from "@marwes-ui/core";
  import { mergeClass } from "../../internal/merge-class.js";
  import RichText from "./RichText.svelte";

  interface RichTextFieldProps {
    id?: string;
    label: string;
    helperText?: string;
    error?: string;
    editor: RichTextOptions & { onvaluechange?: (value: string) => void; class?: string };
    ariaDescribedBy?: string;
  }

  let {
    id: userProvidedId,
    label,
    helperText,
    error,
    editor,
    ariaDescribedBy,
  }: RichTextFieldProps = $props();

  const uniqueId = $props.id();
  const fieldId = $derived(userProvidedId ?? `mw-rich-text-${uniqueId}`);

  function hasTextContent(text: string | undefined): boolean {
    return text !== undefined && text.trim().length > 0;
  }

  const hasHelperText = $derived(hasTextContent(helperText));
  const hasError = $derived(hasTextContent(error));
  const invalid = $derived(hasError || editor.invalid || false);
  const disabled = $derived(editor.disabled || false);
  const readOnly = $derived(editor.readOnly || false);

  const a11yIds = $derived(
    buildRichTextFieldA11yIds({
      id: fieldId,
      hasHelperText,
      hasError,
      externalDescribedBy: ariaDescribedBy,
    })
  );

  const wrapperClass = $derived(
    mergeClass(
      "mw-input-field",
      "mw-input-field--rich-text",
      disabled && "mw-input-field--disabled",
      invalid && "mw-input-field--invalid",
      readOnly && "mw-input-field--readonly",
    )
  );
</script>

<div class={wrapperClass}>
  <button
    type="button"
    class="mw-input-field__label"
    id={a11yIds.labelId}
    onclick={() => {
      const el = document.getElementById(fieldId);
      el?.focus();
    }}
  >
    <p class="mw-p mw-p--md">{label}</p>
  </button>

  <div class="mw-input-field__input-wrapper">
    <RichText
      {...editor}
      id={fieldId}
      {invalid}
      labelledBy={a11yIds.labelId}
      {...(a11yIds.describedBy ? { describedBy: a11yIds.describedBy } : {})}
    />
  </div>

  {#if hasHelperText && !hasError}
    <div class="mw-input-field__helper" id={a11yIds.helperTextId}>
      <p class="mw-p mw-p--sm">{helperText}</p>
    </div>
  {/if}

  {#if hasError}
    <div class="mw-input-field__error" id={a11yIds.errorId} aria-live="polite">
      <p class="mw-p mw-p--sm">{error}</p>
    </div>
  {/if}
</div>
