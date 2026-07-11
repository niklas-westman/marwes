import type { Framework } from "../installation-recipes"

const react = `import { Button, ButtonVariant } from "@marwes-ui/react"

export function Example() {
  return (
    <>
      <Button>Label →</Button>
      <Button variant={ButtonVariant.secondary}>Label →</Button>
      <Button variant={ButtonVariant.text}>Label →</Button>
    </>
  )
}
`

const vue = `<script setup lang="ts">
import { Button } from "@marwes-ui/vue"
</script>

<template>
  <Button>Label →</Button>
  <Button variant="secondary">Label →</Button>
  <Button variant="text">Label →</Button>
</template>
`

const svelte = `<script lang="ts">
  import { Button } from "@marwes-ui/svelte"
</script>

<Button>Label →</Button>
<Button variant="secondary">Label →</Button>
<Button variant="text">Label →</Button>
`

const buttonSnippets: Record<Framework, string> = { react, vue, svelte }

export { buttonSnippets }
