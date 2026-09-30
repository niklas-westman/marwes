<script setup lang="ts">
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
