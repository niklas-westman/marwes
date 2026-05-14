<script lang="ts">
  import Radio from "./Radio.svelte";
  import RadioGroupField from "./RadioGroupField.svelte";

  interface YesNoRadioGroupProps {
    name: string;
    label: string;
    description?: string;
    error?: string;
    yesLabel?: string;
    noLabel?: string;
    value?: string;
    defaultValue?: string;
    onchange?: (value: string) => void;
    disabled?: boolean;
    class?: string;
  }

  let { name, yesLabel = "Yes", noLabel = "No", value, defaultValue, onchange, disabled, ...fieldProps }: YesNoRadioGroupProps = $props();

  let selected = $state(value ?? defaultValue ?? "");

  const options = $derived([
    { value: "yes", label: yesLabel },
    { value: "no", label: noLabel },
  ]);

  function handleChange(optValue: string) {
    selected = optValue;
    onchange?.(optValue);
  }
</script>
<div data-purpose="binary-choice">
  <RadioGroupField {...fieldProps}>
    {#each options as opt (opt.value)}
      <label class="mw-radio-group-field__option">
        <Radio
          {name}
          value={opt.value}
          checked={selected === opt.value}
          disabled={disabled || false}
          onchange={() => handleChange(opt.value)}
        />
        <span class="mw-p mw-p--sm">{opt.label}</span>
      </label>
    {/each}
  </RadioGroupField>
</div>
