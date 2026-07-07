import type { Framework } from "../installation-recipes"

const react = `import { Banner, InfoBanner } from "@marwes-ui/react"

export function Example() {
  return (
    <>
      <Banner>
        Banner message — describe the event, update, or action needed here.
      </Banner>
      <InfoBanner>
        Banner message — describe the event, update, or action needed here.
      </InfoBanner>
    </>
  )
}
`

const vue = `<script setup lang="ts">
import { Banner, InfoBanner } from "@marwes-ui/vue"
</script>

<template>
  <Banner>
    Banner message — describe the event, update, or action needed here.
  </Banner>
  <InfoBanner>
    Banner message — describe the event, update, or action needed here.
  </InfoBanner>
</template>
`

const svelte = `<script lang="ts">
  import { Banner, InfoBanner } from "@marwes-ui/svelte"
</script>

<Banner>
  Banner message — describe the event, update, or action needed here.
</Banner>
<InfoBanner>
  Banner message — describe the event, update, or action needed here.
</InfoBanner>
`

const bannerSnippets: Record<Framework, string> = { react, vue, svelte }

export { bannerSnippets }
