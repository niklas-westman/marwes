<script lang="ts">
  import AccordionField from "../../lib/components/accordion/AccordionField.svelte"
  import type { AccordionFieldProps } from "../../lib/components/accordion/types.js"
  import MarwesProvider from "../../lib/provider/MarwesProvider.svelte"

  let {
    id,
    label,
    description,
    error,
    items,
    openItems,
    defaultOpenItems,
    onopenitemschange,
    multiple,
    ariaDescribedBy,
    disabled,
    class: className,
  }: AccordionFieldProps = $props()
</script>

<MarwesProvider>
  <AccordionField
    {id}
    {label}
    {description}
    {error}
    {items}
    {openItems}
    {defaultOpenItems}
    {onopenitemschange}
    {multiple}
    {ariaDescribedBy}
    {disabled}
    class={className}
  />
</MarwesProvider>
