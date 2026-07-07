import type { Framework } from "../installation-recipes"

const react = `import { RadioGroupField } from "@marwes-ui/react"
import { useState } from "react"

export function Example() {
  const [value, setValue] = useState("1")

  return (
    <RadioGroupField
      name="options"
      label="Group label"
      options={[
        { value: "1", label: "Label" },
        { value: "2", label: "Label" },
        { value: "3", label: "Label" },
      ]}
      value={value}
      onChange={setValue}
    />
  )
}
`

const vue = `<script setup lang="ts">
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
`

const svelte = `<script lang="ts">
  import { RadioGroupField } from "@marwes-ui/svelte"

  let value = $state("1")
</script>

<RadioGroupField
  name="options"
  label="Group label"
  options={[
    { value: "1", label: "Label" },
    { value: "2", label: "Label" },
    { value: "3", label: "Label" },
  ]}
  bind:value
/>
`

const radioSnippets: Record<Framework, string> = { react, vue, svelte }

export { radioSnippets }
