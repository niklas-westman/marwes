<script lang="ts">
  import DropdownField from "../../lib/components/input/DropdownField.svelte"
  import type { SelectProps } from "../../lib/components/input/types.js"
  import MarwesProvider from "../../lib/provider/MarwesProvider.svelte"

  interface Props {
    id?: string
    label: string
    helperText?: string
    error?: string
    select?: SelectProps
    ariaDescribedBy?: string
    value?: string
    class?: string
  }

  let {
    id,
    label,
    helperText,
    error,
    select,
    ariaDescribedBy,
    value = $bindable(""),
    class: className,
  }: Props = $props()
</script>

<MarwesProvider>
  <DropdownField
    {id}
    {label}
    {helperText}
    {error}
    {select}
    {ariaDescribedBy}
    class={className}
    bind:value
  />
</MarwesProvider>
