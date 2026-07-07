import type { Framework } from "../installation-recipes"

const react = `import { Breadcrumb } from "@marwes-ui/react"

export function Example() {
  return (
    <Breadcrumb
      homeHref="/"
      items={[
        { label: "Label", href: "/section" },
        { label: "Label", href: "/section/child" },
        { label: "Current page" },
      ]}
    />
  )
}
`

const vue = `<script setup lang="ts">
import { Breadcrumb } from "@marwes-ui/vue"
</script>

<template>
  <Breadcrumb
    home-href="/"
    :items="[
      { label: 'Label', href: '/section' },
      { label: 'Label', href: '/section/child' },
      { label: 'Current page' },
    ]"
  />
</template>
`

const svelte = `<script lang="ts">
  import { Breadcrumb } from "@marwes-ui/svelte"
</script>

<Breadcrumb
  homeHref="/"
  items={[
    { label: "Label", href: "/section" },
    { label: "Label", href: "/section/child" },
    { label: "Current page" },
  ]}
/>
`

const breadcrumbSnippets: Record<Framework, string> = { react, vue, svelte }

export { breadcrumbSnippets }
