<script lang="ts">
  import Text from "../text/Text.svelte";
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

  function getInitialSelected(): string {
    return defaultValue ?? "";
  }

  const isControlled = $derived(value !== undefined);
  let internalSelected = $state(getInitialSelected());
  const selected = $derived(isControlled ? (value ?? "") : internalSelected);

  const options = $derived([
    { value: "yes", label: yesLabel },
    { value: "no", label: noLabel },
  ]);

  function handleChange(optValue: string) {
    if (!isControlled) {
      internalSelected = optValue;
    }
    onchange?.(optValue);
  }
</script>
<div data-purpose="binary-choice">
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
