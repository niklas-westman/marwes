<script setup lang="ts">
import { ref } from "vue"
import { RadioGroupField } from "@marwes-ui/vue"

const value = ref("1")
</script>

<template>
  <RadioGroupField
    name="options"
    label="Group label"
    :options="[
      { value: '1', label: 'Label' },
      { value: '2', label: 'Label' },
      { value: '3', label: 'Label' },
    ]"
    v-model="value"
  />
</template>
