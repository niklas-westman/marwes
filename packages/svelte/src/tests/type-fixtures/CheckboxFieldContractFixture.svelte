<script lang="ts">
  import CheckboxField from "../../lib/components/checkbox/CheckboxField.svelte"
  import type { CheckboxProps } from "../../lib/components/checkbox/types.js"
  import MarwesProvider from "../../lib/provider/MarwesProvider.svelte"

  interface Props {
    label: string
    description?: string
    error?: string
    ariaDescribedBy?: string
    checked?: boolean
    defaultChecked?: boolean
    disabled?: boolean
  }

  let {
    label,
    description,
    error,
    ariaDescribedBy,
    checked = $bindable(false),
    defaultChecked,
    disabled,
  }: Props = $props()

  const checkbox = $derived({
    ...(defaultChecked !== undefined ? { defaultChecked } : {}),
    ...(disabled !== undefined ? { disabled } : {}),
  } satisfies CheckboxProps)
</script>

<MarwesProvider>
  <CheckboxField
    {label}
    {description}
    {error}
    {ariaDescribedBy}
    {checkbox}
    bind:checked
  />
</MarwesProvider>
