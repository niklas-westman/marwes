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
    showPasswordLabel,
    hidePasswordLabel,
    clearLabel,
    value = $bindable(input?.defaultValue ?? ""),
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
    {showPasswordLabel}
    {hidePasswordLabel}
    {clearLabel}
    class={className}
    bind:value
  />
</MarwesProvider>
