<script lang="ts">
  import SelectField from "../../lib/components/input/SelectField.svelte"
  import type { SelectFieldProps } from "../../lib/components/input/types.js"
  import MarwesProvider from "../../lib/provider/MarwesProvider.svelte"

  function getInitialSelectValue(select: NonNullable<SelectFieldProps["select"]>): string {
    if (select.value !== undefined) {
      return select.value
    }

    if (select.defaultValue !== undefined) {
      return select.defaultValue
    }

    if (select.placeholder !== undefined) {
      return ""
    }

    return select.options[0]?.value ?? ""
  }

  let {
    id,
    label,
    helperText,
    error,
    select = { options: [] },
    ariaDescribedBy,
    value = $bindable(getInitialSelectValue(select)),
    class: className,
  }: SelectFieldProps = $props()
</script>

<MarwesProvider>
  <SelectField
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
