<script lang="ts">
  import InputOtpField from "../../lib/components/input/InputOtpField.svelte"
  import type { InputOtpFieldProps, InputOtpProps } from "../../lib/components/input/types.js"
  import MarwesProvider from "../../lib/provider/MarwesProvider.svelte"

  interface InputOtpContractFixtureProps extends Omit<InputOtpFieldProps, "inputOtp"> {
    name?: InputOtpProps["name"]
    value?: InputOtpProps["value"]
    defaultValue?: InputOtpProps["defaultValue"]
    length?: InputOtpProps["length"]
    placeholderCharacter?: InputOtpProps["placeholderCharacter"]
    disabled?: InputOtpProps["disabled"]
    readOnly?: InputOtpProps["readOnly"]
    required?: InputOtpProps["required"]
    invalid?: InputOtpProps["invalid"]
    onvaluechange?: InputOtpProps["onvaluechange"]
  }

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
    onvaluechange,
    class: className,
  }: InputOtpContractFixtureProps = $props()

  const inputOtp = $derived.by((): InputOtpFieldProps["inputOtp"] => ({
    name,
    value,
    defaultValue,
    length,
    placeholderCharacter,
    disabled,
    readOnly,
    required,
    invalid,
    onvaluechange,
  }))
</script>

<MarwesProvider>
  <InputOtpField
    {id}
    {label}
    {helperText}
    {error}
    {ariaDescribedBy}
    {inputOtp}
    class={className}
  />
</MarwesProvider>
