<script setup lang="ts">
import { ref } from "vue"
import { CheckboxField, CheckboxGroupField } from "@marwes-ui/vue"

const checked = ref(false)
const values = ref<string[]>(["1"])
</script>

<template>
  <CheckboxField
    label="Label"
    :checkbox="{ checked, onCheckedChange: (v) => (checked = v) }"
  />
  <CheckboxGroupField
    label="Group label"
    :options="[
      { value: '1', label: 'Label' },
      { value: '2', label: 'Label' },
      { value: '3', label: 'Label' },
    ]"
    v-model="values"
  />
</template>
