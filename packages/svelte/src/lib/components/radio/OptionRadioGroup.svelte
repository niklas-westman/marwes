<script lang="ts">
  import Radio from "./Radio.svelte";
  import RadioGroupField from "./RadioGroupField.svelte";

  interface OptionRadioGroupProps {
    name: string;
    label: string;
    description?: string;
    error?: string;
    ariaDescribedBy?: string;
    options: Array<{ value: string; label: string; disabled?: boolean }>;
    value?: string;
    defaultValue?: string;
    onchange?: (value: string) => void;
    disabled?: boolean;
    required?: boolean;
    class?: string;
  }

  let { name, options, value, defaultValue, onchange, disabled, required, error, ...fieldProps }: OptionRadioGroupProps = $props();

  let selected = $state(value ?? defaultValue ?? "");
  const isInvalid = $derived(error !== undefined && error.trim().length > 0);

  function handleChange(optValue: string) {
    selected = optValue;
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
    <label class="mw-radio-group-field__option">
      <Radio
        {name}
        value={opt.value}
        checked={selected === opt.value}
        disabled={disabled || opt.disabled || false}
        invalid={isInvalid}
        required={required === true}
        onchange={() => handleChange(opt.value)}
      />
      <span class="mw-p mw-p--sm">{opt.label}</span>
    </label>
  {/each}
</RadioGroupField>
