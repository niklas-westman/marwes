<script lang="ts">
  import { buildSwitchFieldA11yIds } from "@marwes-ui/core";
  import { mergeClass } from "../../internal/merge-class.js";
  import Switch from "./Switch.svelte";
  import type { SwitchProps } from "./types.js";

  interface SwitchFieldProps {
    id?: string;
    label: string;
    description?: string;
    error?: string;
    switch?: Omit<SwitchProps, "children">;
    ariaDescribedBy?: string;
    class?: string;
  }

  let {
    id: userProvidedId,
    label,
    description,
    error,
    switch: switchProps = {},
    ariaDescribedBy,
    class: className,
  }: SwitchFieldProps = $props();

  const uniqueId = $props.id();
  const fieldId = $derived(userProvidedId ?? `mw-switch-${uniqueId}`);

  function hasTextContent(text: string | undefined): boolean {
    return text !== undefined && text.trim().length > 0;
  }

  const hasDescription = $derived(hasTextContent(description));
  const hasError = $derived(hasTextContent(error));
  const disabled = $derived(switchProps.disabled || false);

  const a11yIds = $derived(
    buildSwitchFieldA11yIds({
      id: fieldId,
      hasDescription,
      hasError,
      externalDescribedBy: ariaDescribedBy,
    })
  );

  const wrapperClass = $derived(
    mergeClass(
      "mw-switch-field",
      disabled && "mw-switch-field--disabled",
      className
    )
  );
</script>

<div class={wrapperClass}>
  <div class="mw-switch-field__row">
    <Switch
      {...switchProps}
      id={fieldId}
      ariaDescribedBy={a11yIds.describedBy}
      ariaLabel={label}
    />
    <label class="mw-switch-field__label" for={fieldId}>
      <p class="mw-p mw-p--md">{label}</p>
    </label>
  </div>

  {#if hasDescription}
    <div class="mw-switch-field__description" id={a11yIds.descriptionId}>
      <p class="mw-p mw-p--sm">{description}</p>
    </div>
  {/if}

  {#if hasError}
    <div class="mw-switch-field__error" id={a11yIds.errorId} aria-live="polite">
      <p class="mw-p mw-p--sm">{error}</p>
    </div>
  {/if}
</div>
