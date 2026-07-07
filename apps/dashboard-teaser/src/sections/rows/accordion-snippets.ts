import type { Framework } from "../installation-recipes"

const react = `import { AccordionField } from "@marwes-ui/react"
import { useState } from "react"

export function Example() {
  const [openItems, setOpenItems] = useState<string[]>(["1"])

  return (
    <AccordionField
      label=""
      items={[
        { value: "1", title: "Accordion title", content: "First section content." },
        { value: "2", title: "Accordion title", content: "Second section content." },
        { value: "3", title: "Accordion title", content: "Third section content." },
      ]}
      openItems={openItems}
      onOpenItemsChange={setOpenItems}
    />
  )
}
`

const vue = `<script setup lang="ts">
import { ref } from "vue"
import { AccordionField } from "@marwes-ui/vue"

const openItems = ref<string[]>(["1"])
</script>

<template>
  <AccordionField
    label=""
    :items="[
      { value: '1', title: 'Accordion title', content: 'First section content.' },
      { value: '2', title: 'Accordion title', content: 'Second section content.' },
      { value: '3', title: 'Accordion title', content: 'Third section content.' },
    ]"
    v-model:open-items="openItems"
  />
</template>
`

const svelte = `<script lang="ts">
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
  bind:openItems
/>
`

const accordionSnippets: Record<Framework, string> = { react, vue, svelte }

export { accordionSnippets }
