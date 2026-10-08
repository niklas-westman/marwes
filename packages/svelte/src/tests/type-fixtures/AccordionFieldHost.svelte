<script lang="ts">
  import AccordionField from "../../lib/components/accordion/AccordionField.svelte"
  import type { AccordionFieldProps } from "../../lib/components/accordion/types.js"
  import MarwesProvider from "../../lib/provider/MarwesProvider.svelte"

  let props: AccordionFieldProps = $props()
</script>

<MarwesProvider>
  <AccordionField {...props} />
</MarwesProvider>
