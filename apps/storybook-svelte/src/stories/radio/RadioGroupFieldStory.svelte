<script lang="ts">
  import { Paragraph, RadioGroupField } from "@marwes-ui/svelte"
  import Radio from "../../../../../packages/svelte/src/lib/components/radio/Radio.svelte"

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
      <Paragraph size="md">{opt.label}</Paragraph>
    </label>
  {/each}
</RadioGroupField>
