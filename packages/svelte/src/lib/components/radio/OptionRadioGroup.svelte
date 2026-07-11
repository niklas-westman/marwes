<script lang="ts">
  import Text from "../text/Text.svelte";
  import Radio from "./Radio.svelte";
  import RadioGroupField from "./RadioGroupField.svelte";
  import type { RadioGroupFieldOption } from "./types.js";

  interface OptionRadioGroupProps {
    name: string;
    label: string;
    description?: string;
    error?: string;
    ariaDescribedBy?: string;
    options: RadioGroupFieldOption[];
    value?: string;
    defaultValue?: string;
    onchange?: (value: string) => void;
    disabled?: boolean;
    required?: boolean;
    class?: string;
  }

  let { name, options, value, defaultValue, onchange, disabled, required, error, ...fieldProps }: OptionRadioGroupProps = $props();

  function getInitialSelected(): string {
    return defaultValue ?? "";
  }

  const isControlled = $derived(value !== undefined);
  let internalSelected = $state(getInitialSelected());
  const selected = $derived(isControlled ? (value ?? "") : internalSelected);
  const isInvalid = $derived(error !== undefined && error.trim().length > 0);

  function hasTextContent(text: string | undefined): boolean {
    return text !== undefined && text.trim().length > 0;
  }

  function handleChange(optValue: string) {
    if (!isControlled) {
      internalSelected = optValue;
    }
    onchange?.(optValue);
  }
</script>

<RadioGroupField
  {...fieldProps}
  error={error ?? ""}
  disabled={disabled === true}
  required={required === true}
  dataAttributes={{ "data-purpose": "selection" }}
>
  {#each options as opt (opt.value)}
    {@const optionLabelId = `${name}-${opt.value}-label`}
    {@const optionDescriptionId = `${name}-${opt.value}-description`}
    {@const hasOptionDescription = hasTextContent(opt.description)}
    <label
      class={`mw-radio-group-field__option${hasOptionDescription ? " mw-radio-group-field__option--with-description" : ""}`}
    >
      <Radio
        {name}
        value={opt.value}
        ariaLabelledBy={optionLabelId}
        {...(hasOptionDescription ? { ariaDescribedBy: optionDescriptionId } : {})}
        checked={selected === opt.value}
        disabled={disabled || opt.disabled || false}
        invalid={isInvalid}
        required={required === true}
        onchange={() => handleChange(opt.value)}
      />
      <span class="mw-radio-group-field__option-content">
        <Text id={optionLabelId} variant="label" class="mw-radio-group-field__option-label">
          {opt.label}
        </Text>
        {#if hasOptionDescription}
          <Text
            id={optionDescriptionId}
            variant="label-small"
            class="mw-radio-group-field__option-description"
          >
            {opt.description}
          </Text>
        {/if}
      </span>
    </label>
  {/each}
</RadioGroupField>
