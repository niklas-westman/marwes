<script lang="ts">
  import SwitchField from "../../lib/components/switch/SwitchField.svelte"
  import type { SwitchFieldProps } from "../../lib/components/switch/types.js"
  import MarwesProvider from "../../lib/provider/MarwesProvider.svelte"

  let {
    id,
    label,
    description,
    error,
    switch: switchProps,
    ariaDescribedBy,
    class: className,
  }: SwitchFieldProps = $props()
</script>

<MarwesProvider>
  <SwitchField
    {id}
    {label}
    {description}
    {error}
    switch={switchProps}
    {ariaDescribedBy}
    class={className}
  />
</MarwesProvider>
