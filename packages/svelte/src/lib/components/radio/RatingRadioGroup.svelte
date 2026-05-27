<script lang="ts">
  import Text from "../text/Text.svelte";
  import Radio from "./Radio.svelte";
  import RadioGroupField from "./RadioGroupField.svelte";

  interface RatingRadioGroupProps {
    name: string;
    label: string;
    description?: string;
    error?: string;
    min?: number;
    max?: number;
    labelFn?: (value: number) => string;
    value?: string;
    defaultValue?: string;
    onchange?: (value: string) => void;
    disabled?: boolean;
    class?: string;
  }

  let { name, min = 1, max = 5, labelFn = String, value, defaultValue, onchange, disabled, ...fieldProps }: RatingRadioGroupProps = $props();

  let selected = $state(value ?? defaultValue ?? "");

  const options = $derived(
    Array.from({ length: max - min + 1 }, (_, i) => {
      const v = min + i;
      return { value: String(v), label: labelFn(v) };
    })
  );

  function handleChange(optValue: string) {
    selected = optValue;
    onchange?.(optValue);
  }
</script>
<div data-purpose="rating">
  <RadioGroupField {...fieldProps}>
    {#each options as opt (opt.value)}
      {@const optionLabelId = `${name}-${opt.value}-label`}
      <label class="mw-radio-group-field__option">
        <Radio
          {name}
          value={opt.value}
          ariaLabelledBy={optionLabelId}
          checked={selected === opt.value}
          disabled={disabled || false}
          onchange={() => handleChange(opt.value)}
        />
        <span class="mw-radio-group-field__option-content">
          <Text id={optionLabelId} variant="label" class="mw-radio-group-field__option-label">
            {opt.label}
          </Text>
        </span>
      </label>
    {/each}
  </RadioGroupField>
</div>
