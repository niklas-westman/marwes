import type { Framework } from "../installation-recipes"

const react = `import { CheckboxField, CheckboxGroupField } from "@marwes-ui/react"
import { useState } from "react"

export function Example() {
  const [checked, setChecked] = useState(false)
  const [values, setValues] = useState<string[]>(["1"])

  return (
    <>
      <CheckboxField
        label="Label"
        checkbox={{ checked, onCheckedChange: setChecked }}
      />
      <CheckboxGroupField
        label="Group label"
        options={[
          { value: "1", label: "Label" },
          { value: "2", label: "Label" },
          { value: "3", label: "Label" },
        ]}
        value={values}
        onChange={setValues}
      />
    </>
  )
}
`

const vue = `<script setup lang="ts">
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
`

const svelte = `<script lang="ts">
  import { CheckboxField, CheckboxGroupField } from "@marwes-ui/svelte"

  let checked = $state(false)
  let values = $state<string[]>(["1"])
</script>

<CheckboxField
  label="Label"
  checkbox={{ checked, onCheckedChange: (v) => (checked = v) }}
/>
<CheckboxGroupField
  label="Group label"
  options={[
    { value: "1", label: "Label" },
    { value: "2", label: "Label" },
    { value: "3", label: "Label" },
  ]}
  bind:value={values}
/>
`

const checkboxSnippets: Record<Framework, string> = { react, vue, svelte }

export { checkboxSnippets }
