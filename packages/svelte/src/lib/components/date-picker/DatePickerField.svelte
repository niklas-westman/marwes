<script lang="ts">
  import { buildInputFieldA11yIds } from "@marwes-ui/core";
  import { mergeClass } from "../../internal/merge-class.js";
  import Text from "../text/Text.svelte";
  import DatePicker from "./DatePicker.svelte";
  import type { DatePickerFieldProps, DatePickerProps } from "./types.js";

  let {
    id: userProvidedId,
    label,
    helperText,
    error,
    datePicker = {},
    ariaDescribedBy,
    class: className,
  }: DatePickerFieldProps = $props();

  const uniqueId = $props.id();
  const fieldId = $derived(userProvidedId ?? `mw-date-picker-${uniqueId}`);
  const labelId = $derived(`${fieldId}-label`);

  function hasTextContent(text: string | undefined): boolean {
    return text !== undefined && text.trim().length > 0;
  }

  const hasHelperText = $derived(hasTextContent(helperText));
  const hasError = $derived(hasTextContent(error));

  const a11yIds = $derived(
    buildInputFieldA11yIds({
      id: fieldId,
      hasHelperText,
      hasError,
      externalDescribedBy: ariaDescribedBy,
    })
  );

  const wrapperClass = $derived(
    mergeClass("mw-date-picker-field", hasError && "mw-date-picker-field--invalid", className)
  );

  const datePickerProps = $derived.by((): DatePickerProps => {
    const props: DatePickerProps = {
      ...datePicker,
      ariaLabelledBy: labelId,
    };
    if (a11yIds.describedBy) {
      props.ariaDescribedBy = a11yIds.describedBy;
    }
    return props;
  });
</script>

<div class={wrapperClass}>
  <span class="mw-date-picker-field__label" id={labelId}>
    <Text variant="label">{label}</Text>
  </span>

  <DatePicker {...datePickerProps} />

  {#if hasHelperText && !hasError}
    <div class="mw-date-picker-field__helper" id={a11yIds.helperTextId}>
      <Text variant="caption">{helperText}</Text>
    </div>
  {/if}

  {#if hasError}
    <div class="mw-date-picker-field__error" id={a11yIds.errorId} aria-live="polite">
      <Text variant="caption">{error}</Text>
    </div>
  {/if}
</div>
