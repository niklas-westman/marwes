<script lang="ts">
  import type { Snippet } from "svelte"
  import CheckboxGroupField from "../../lib/components/checkbox/CheckboxGroupField.svelte"
  import MarwesProvider from "../../lib/provider/MarwesProvider.svelte"

  interface Props {
    label: string
    description?: string
    error?: string
    ariaDescribedBy?: string
    required?: boolean
    children?: Snippet
  }

  let { label, description, error, ariaDescribedBy, required, children }: Props = $props()
</script>

<MarwesProvider>
  <CheckboxGroupField {label} {description} {error} {ariaDescribedBy} {required}>
    {@render children?.()}
  </CheckboxGroupField>
</MarwesProvider>
