<script lang="ts">
  import { Radio, RadioGroupField } from "@marwes-ui/svelte"

  interface Props {
    name: string
    label: string
    description?: string
    error?: string
    options?: Array<{ value: string; label: string; disabled?: boolean }>
    defaultValue?: string
    disabled?: boolean
  }

  let { name, label, description, error, options = [], defaultValue, disabled }: Props = $props()
  let selected = $state(defaultValue ?? "")

  function handleChange(optValue: string) {
    selected = optValue
  }
</script>

<RadioGroupField {label} {description} {error}>
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
