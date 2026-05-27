<script lang="ts">
  import InputField from "../../lib/components/input/InputField.svelte"
  import type { InputFieldProps } from "../../lib/components/input/types.js"
  import MarwesProvider from "../../lib/provider/MarwesProvider.svelte"

  let {
    id,
    label,
    helperText,
    error,
    input,
    ariaDescribedBy,
    leadingSymbol,
    value = $bindable(""),
    class: className,
  }: InputFieldProps = $props()
</script>

<MarwesProvider>
  <InputField
    {id}
    {label}
    {helperText}
    {error}
    {input}
    {ariaDescribedBy}
    {leadingSymbol}
    class={className}
    bind:value
  />
</MarwesProvider>
