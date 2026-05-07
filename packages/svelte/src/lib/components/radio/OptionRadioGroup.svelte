<script lang="ts">
  import Radio from "./Radio.svelte";
  import RadioGroupField from "./RadioGroupField.svelte";

  interface OptionRadioGroupProps {
    name: string;
    label: string;
    description?: string;
    error?: string;
    options: Array<{ value: string; label: string; disabled?: boolean }>;
    value?: string;
    defaultValue?: string;
    onchange?: (value: string) => void;
    disabled?: boolean;
    class?: string;
  }

  let { name, options, value, defaultValue, onchange, disabled, ...fieldProps }: OptionRadioGroupProps = $props();

  let selected = $state(value ?? defaultValue ?? "");

  function handleChange(optValue: string) {
    selected = optValue;
    onchange?.(optValue);
  }
</script>
<div data-purpose="selection">
  <RadioGroupField {...fieldProps}>
    {#each options as opt (opt.value)}
      <label class="mw-radio-group-field__option">
        <Radio
          {name}
          value={opt.value}
          checked={selected === opt.value}
          disabled={disabled || opt.disabled || false}
          onchange={() => handleChange(opt.value)}
        />
        <span class="mw-p mw-p--md">{opt.label}</span>
      </label>
    {/each}
  </RadioGroupField>
</div>
