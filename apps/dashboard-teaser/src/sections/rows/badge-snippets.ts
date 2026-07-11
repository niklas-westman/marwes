import type { Framework } from "../installation-recipes"

const react = `import { Badge } from "@marwes-ui/react"

export function Example() {
  return (
    <>
      <Badge>Badge</Badge>
      <Badge variant="info">Badge</Badge>
      <Badge variant="success">Badge</Badge>
      <Badge variant="warning">Badge</Badge>
      <Badge variant="error">Badge</Badge>
    </>
  )
}
`

const vue = `<script setup lang="ts">
import { Badge } from "@marwes-ui/vue"
</script>

<template>
  <Badge>Badge</Badge>
  <Badge variant="info">Badge</Badge>
  <Badge variant="success">Badge</Badge>
  <Badge variant="warning">Badge</Badge>
  <Badge variant="error">Badge</Badge>
</template>
`

const svelte = `<script lang="ts">
  import { Badge } from "@marwes-ui/svelte"
</script>

<Badge>Badge</Badge>
<Badge variant="info">Badge</Badge>
<Badge variant="success">Badge</Badge>
<Badge variant="warning">Badge</Badge>
<Badge variant="error">Badge</Badge>
`

const badgeSnippets: Record<Framework, string> = { react, vue, svelte }

export { badgeSnippets }
