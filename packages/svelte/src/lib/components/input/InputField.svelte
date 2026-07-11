<script lang="ts">
  import { buildInputFieldA11yIds } from "@marwes-ui/core";
  import { mergeClass } from "../../internal/merge-class.js";
  import Icon from "../icon/Icon.svelte";
  import Text from "../text/Text.svelte";
  import Input from "./Input.svelte";
  import type { InputFieldProps } from "./types.js";

  let {
    id: userProvidedId,
    label,
    helperText,
    error,
    input = {},
    ariaDescribedBy,
    leadingSymbol,
    value = $bindable(""),
    class: className,
  }: InputFieldProps = $props();

  const uniqueId = $props.id();
  const fieldId = $derived(userProvidedId ?? `mw-input-${uniqueId}`);

  function hasTextContent(text: string | undefined): boolean {
    return text !== undefined && text.trim().length > 0;
  }

  const hasHelperText = $derived(hasTextContent(helperText));
  const hasError = $derived(hasTextContent(error));
  const invalid = $derived(hasError || input.invalid || false);
  const disabled = $derived(input.disabled || false);
  const readOnly = $derived(input.readOnly || false);

  // Separate type from input to allow override for password toggle
  const { type: inputType, ...inputRest } = $derived(input);

  // Password visibility toggle
  const isPasswordField = $derived(inputType === "password");
  let showPassword = $state(false);
  const effectiveInputType = $derived(
    isPasswordField && showPassword ? "text" as const : inputType
  );

  function togglePassword(): void {
    showPassword = !showPassword;
  }

  // Search clear button
  const isSearchField = $derived(inputType === "search");
  const hasSearchValue = $derived(isSearchField && String(value).length > 0);
  const showSearchClearButton = $derived(hasSearchValue && !disabled && !readOnly);
  const showSearchIcon = $derived(isSearchField && !showSearchClearButton);

  function clearSearch(): void {
    value = "";
  }

  const a11yIds = $derived(
    buildInputFieldA11yIds({
      id: fieldId,
      hasHelperText,
      hasError,
      externalDescribedBy: ariaDescribedBy,
    })
  );

  const wrapperClass = $derived(
    mergeClass(
      "mw-input-field",
      disabled && "mw-input-field--disabled",
      invalid && "mw-input-field--invalid",
      readOnly && "mw-input-field--readonly",
      className
    )
  );
</script>

<div class={wrapperClass}>
  <label class="mw-input-field__label" for={fieldId}>
    <Text variant="label">{label}</Text>
  </label>

  <div class="mw-input-field__input-wrapper">
    {#if leadingSymbol}
      <span class="mw-input-field__leading-symbol" aria-hidden="true">
        {leadingSymbol}
      </span>
    {/if}
    <Input
      {...inputRest}
      {...(effectiveInputType ? { type: effectiveInputType } : {})}
      id={fieldId}
      {invalid}
      describedBy={a11yIds.describedBy ?? undefined}
      bind:value
    />

    {#if isPasswordField && !disabled}
      <button
        type="button"
        class="mw-input-field__toggle-password"
        onclick={togglePassword}
        aria-label={showPassword ? "Hide password" : "Show password"}
        tabindex={0}
      >
        <Icon name={showPassword ? "eyeOff" : "eye"} size="xs" decorative />
      </button>
    {/if}

    {#if showSearchIcon}
      <span class="mw-input-field__search-icon" aria-hidden="true">
        <Icon name="search" size="xs" decorative />
      </span>
    {/if}

    {#if showSearchClearButton}
      <button
        type="button"
        class="mw-input-field__clear-search"
        onclick={clearSearch}
        aria-label="Clear search"
        tabindex={0}
      >
        <Icon name="x" size="xs" decorative />
      </button>
    {/if}
  </div>

  {#if hasHelperText && !hasError}
    <div class="mw-input-field__helper" id={a11yIds.helperTextId}>
      <Text variant="caption">{helperText}</Text>
    </div>
  {/if}

  {#if hasError}
    <div class="mw-input-field__error" id={a11yIds.errorId} aria-live="polite">
      <Text variant="caption">{error}</Text>
    </div>
  {/if}
</div>
