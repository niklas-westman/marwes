import type { Framework } from "../installation-recipes"

const react = `import { SwitchField } from "@marwes-ui/react"
import { useState } from "react"

export function Example() {
  const [checked, setChecked] = useState(false)

  return (
    <SwitchField
      label="Label"
      switch={{ checked, onCheckedChange: setChecked }}
    />
  )
}
`

const vue = `<script setup lang="ts">
import { ref } from "vue"
import { SwitchField } from "@marwes-ui/vue"

const checked = ref(false)
</script>

<template>
  <SwitchField label="Label" :switch="{ checked, onCheckedChange: (v) => (checked = v) }" />
</template>
`

const svelte = `<script lang="ts">
  import { SwitchField } from "@marwes-ui/svelte"

  let checked = $state(false)
</script>

<SwitchField
  label="Label"
  switch={{ checked, onCheckedChange: (v) => (checked = v) }}
/>
`

const switchSnippets: Record<Framework, string> = { react, vue, svelte }

export { switchSnippets }
