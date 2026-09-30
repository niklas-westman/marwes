<script setup lang="ts">
import { ref } from "vue"
import { SwitchField } from "@marwes-ui/vue"

const checked = ref(false)
</script>

<template>
  <SwitchField label="Label" :switch="{ checked, onCheckedChange: (v) => (checked = v) }" />
</template>
