import type { Framework } from "../installation-recipes"

const react = `import { Button, ButtonVariant, Spinner } from "@marwes-ui/react"

export function Example() {
  return (
    <>
      <Spinner variant="ring" />
      <Spinner variant="classic" />
      <Spinner variant="dots-round" />

      <Button
        variant={ButtonVariant.primary}
        loading={{
          isLoading: true,
          disableWhileLoading: false,
          spinnerVariant: "ring",
          loadingLabel: "Loading…",
        }}
      >
        Done!
      </Button>
    </>
  )
}
`

const vue = `<script setup lang="ts">
import { Button, Spinner } from "@marwes-ui/vue"
</script>

<template>
  <Spinner variant="ring" />
  <Spinner variant="classic" />
  <Spinner variant="dots-round" />

  <Button
    variant="primary"
    :loading="{
      isLoading: true,
      disableWhileLoading: false,
      spinnerVariant: 'ring',
      loadingLabel: 'Loading…',
    }"
  >
    Done!
  </Button>
</template>
`

const svelte = `<script lang="ts">
  import { Button, Spinner } from "@marwes-ui/svelte"
</script>

<Spinner variant="ring" />
<Spinner variant="classic" />
<Spinner variant="dots-round" />

<Button
  variant="primary"
  loading={{
    isLoading: true,
    disableWhileLoading: false,
    spinnerVariant: "ring",
    loadingLabel: "Loading…",
  }}
>
  Done!
</Button>
`

const spinnerSnippets: Record<Framework, string> = { react, vue, svelte }

export { spinnerSnippets }
