import type { Framework } from "../installation-recipes"

const react = `import { ProgressBar } from "@marwes-ui/react"

export function Example() {
  return <ProgressBar label="Progress" value={60} size="small" />
}
`

const vue = `<script setup lang="ts">
import { ProgressBar } from "@marwes-ui/vue"
</script>

<template>
  <ProgressBar label="Progress" :value="60" size="small" />
</template>
`

const svelte = `<script lang="ts">
  import { ProgressBar } from "@marwes-ui/svelte"
</script>

<ProgressBar label="Progress" value={60} size="small" />
`

const progressSnippets: Record<Framework, string> = { react, vue, svelte }

export { progressSnippets }
