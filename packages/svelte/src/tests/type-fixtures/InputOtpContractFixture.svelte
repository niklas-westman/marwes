<script lang="ts">
  import InputOtp from "../../lib/components/input/InputOtp.svelte"
  import type { InputOtpProps } from "../../lib/components/input/types.js"
  import MarwesProvider from "../../lib/provider/MarwesProvider.svelte"

  let {
    id,
    name,
    label,
    helperText,
    error,
    ariaDescribedBy,
    value,
    defaultValue,
    length,
    placeholderCharacter,
    disabled,
    readOnly,
    required,
    invalid,
    ariaLabel,
    onvaluechange,
    class: className,
  }: InputOtpProps = $props()
</script>

<MarwesProvider>
  <InputOtp
    {id}
    {name}
    {label}
    {helperText}
    {error}
    {ariaDescribedBy}
    {value}
    {defaultValue}
    {length}
    {placeholderCharacter}
    {disabled}
    {readOnly}
    {required}
    {invalid}
    {ariaLabel}
    {onvaluechange}
    class={className}
  />
</MarwesProvider>
