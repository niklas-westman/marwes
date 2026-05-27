<script lang="ts">
  import ZipCodeField from "../../lib/components/input/ZipCodeField.svelte"
  import type { InputProps } from "../../lib/components/input/types.js"
  import MarwesProvider from "../../lib/provider/MarwesProvider.svelte"

  interface Props {
    id?: string
    label: string
    helperText?: string
    error?: string
    input?: Omit<InputProps, "type" | "inputMode" | "autoComplete">
    ariaDescribedBy?: string
    value?: string
    class?: string
  }

  let {
    id,
    label,
    helperText,
    error,
    input,
    ariaDescribedBy,
    value = $bindable(""),
    class: className,
  }: Props = $props()
</script>

<MarwesProvider>
  <ZipCodeField
    {id}
    {label}
    {helperText}
    {error}
    {input}
    {ariaDescribedBy}
    class={className}
    bind:value
  />
</MarwesProvider>
