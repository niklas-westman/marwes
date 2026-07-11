import type { Framework } from "../installation-recipes"

const react = `import { Pagination } from "@marwes-ui/react"
import { useState } from "react"

export function Example() {
  const [page, setPage] = useState(1)

  return (
    <Pagination
      page={page}
      pageCount={10}
      controlDisplay="label"
      maxVisibleItems={5}
      onPageChange={setPage}
    />
  )
}
`

const vue = `<script setup lang="ts">
import { ref } from "vue"
import { Pagination } from "@marwes-ui/vue"

const page = ref(1)
</script>

<template>
  <Pagination
    v-model="page"
    :page-count="10"
    control-display="label"
    :max-visible-items="5"
  />
</template>
`

const svelte = `<script lang="ts">
  import { Pagination } from "@marwes-ui/svelte"

  let page = $state(1)
</script>

<Pagination
  bind:page
  pageCount={10}
  controlDisplay="label"
  maxVisibleItems={5}
/>
`

const paginationSnippets: Record<Framework, string> = { react, vue, svelte }

export { paginationSnippets }
