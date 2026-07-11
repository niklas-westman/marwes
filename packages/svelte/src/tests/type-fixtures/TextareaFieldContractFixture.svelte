<script lang="ts">
  import TextareaField from "../../lib/components/input/TextareaField.svelte"
  import type { TextareaFieldProps } from "../../lib/components/input/types.js"
  import MarwesProvider from "../../lib/provider/MarwesProvider.svelte"

  let {
    id,
    label,
    helperText,
    counterText,
    error,
    textarea,
    ariaDescribedBy,
    value = $bindable(""),
    class: className,
  }: TextareaFieldProps = $props()
</script>

<MarwesProvider>
  <TextareaField
    {id}
    {label}
    {helperText}
    {counterText}
    {error}
    {textarea}
    {ariaDescribedBy}
    class={className}
    bind:value
  />
</MarwesProvider>
