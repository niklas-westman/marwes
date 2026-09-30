<script lang="ts">
  import { AccordionField } from "@marwes-ui/svelte"

  let openItems = $state<string[]>(["1"])
</script>

<AccordionField
  label=""
  items={[
    { value: "1", title: "Accordion title", content: "First section content." },
    { value: "2", title: "Accordion title", content: "Second section content." },
    { value: "3", title: "Accordion title", content: "Third section content." },
  ]}
  {openItems}
  onopenitemschange={(items) => (openItems = items)}
/>
