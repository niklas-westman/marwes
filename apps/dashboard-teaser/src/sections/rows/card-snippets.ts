import type { Framework } from "../installation-recipes"

const react = `import { Card } from "@marwes-ui/react"

export function Example() {
  return (
    <Card title="Card title">
      Card description text goes here. This provides more context about the card content.
    </Card>
  )
}
`

const vue = `<script setup lang="ts">
import { Card } from "@marwes-ui/vue"
</script>

<template>
  <Card title="Card title">
    Card description text goes here. This provides more context about the card content.
  </Card>
</template>
`

const svelte = `<script lang="ts">
  import { Card } from "@marwes-ui/svelte"
</script>

<Card title="Card title">
  Card description text goes here. This provides more context about the card content.
</Card>
`

const cardSnippets: Record<Framework, string> = { react, vue, svelte }

export { cardSnippets }
