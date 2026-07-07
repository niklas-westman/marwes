import type { Framework } from "../installation-recipes"

const react = `import { Icon, IconName, SegmentedControl } from "@marwes-ui/react"
import { useState } from "react"

export function Example() {
  const [density, setDensity] = useState("compact")
  const [mode, setMode] = useState("compact")
  const [theme, setTheme] = useState("light")

  return (
    <>
      <SegmentedControl
        items={[
          { value: "compact", label: "Compact" },
          { value: "wide", label: "Wide" },
        ]}
        value={density}
        onValueChange={setDensity}
        variant="inverse"
        ariaLabel="View density"
        fullWidth
      />
      <SegmentedControl
        items={[
          { value: "compact", icon: <Icon name={IconName.Star} decorative size={12} />, label: "Compact" },
          { value: "wide", icon: <Icon name={IconName.Settings} decorative size={12} />, label: "Wide" },
          { value: "rich", icon: <Icon name={IconName.Star} decorative size={12} />, label: "Rich" },
        ]}
        value={mode}
        onValueChange={setMode}
        variant="inverse"
        ariaLabel="View mode"
        fullWidth
      />
      <SegmentedControl
        items={[
          { value: "light", icon: <Icon name={IconName.Sun} decorative size={12} />, ariaLabel: "Light" },
          { value: "dark", icon: <Icon name={IconName.Moon} decorative size={12} />, ariaLabel: "Dark" },
        ]}
        value={theme}
        onValueChange={setTheme}
        variant="inverse"
        size="sm"
        ariaLabel="Theme"
      />
    </>
  )
}
`

const vue = `<script setup lang="ts">
import { h, ref } from "vue"
import { Icon, IconName, SegmentedControl } from "@marwes-ui/vue"

const density = ref("compact")
const mode = ref("compact")
const theme = ref("light")

const modeItems = [
  { value: "compact", icon: h(Icon, { name: IconName.Star, decorative: true, size: 12 }), label: "Compact" },
  { value: "wide", icon: h(Icon, { name: IconName.Settings, decorative: true, size: 12 }), label: "Wide" },
  { value: "rich", icon: h(Icon, { name: IconName.Star, decorative: true, size: 12 }), label: "Rich" },
]

const themeItems = [
  { value: "light", icon: h(Icon, { name: IconName.Sun, decorative: true, size: 12 }), ariaLabel: "Light" },
  { value: "dark", icon: h(Icon, { name: IconName.Moon, decorative: true, size: 12 }), ariaLabel: "Dark" },
]
</script>

<template>
  <SegmentedControl
    :items="[
      { value: 'compact', label: 'Compact' },
      { value: 'wide', label: 'Wide' },
    ]"
    v-model="density"
    variant="inverse"
    aria-label="View density"
    full-width
  />
  <SegmentedControl :items="modeItems" v-model="mode" variant="inverse" aria-label="View mode" full-width />
  <SegmentedControl :items="themeItems" v-model="theme" variant="inverse" size="sm" aria-label="Theme" />
</template>
`

const svelte = `<script lang="ts">
  import { Icon, IconName, SegmentedControl } from "@marwes-ui/svelte"

  let density = $state("compact")
  let mode = $state("compact")
  let theme = $state("light")
</script>

<SegmentedControl
  items={[
    { value: "compact", label: "Compact" },
    { value: "wide", label: "Wide" },
  ]}
  bind:value={density}
  variant="inverse"
  ariaLabel="View density"
  fullWidth
/>
<SegmentedControl
  items={[
    { value: "compact", label: "Compact" },
    { value: "wide", label: "Wide" },
    { value: "rich", label: "Rich" },
  ]}
  bind:value={mode}
  variant="inverse"
  ariaLabel="View mode"
  fullWidth
/>
<SegmentedControl
  items={[
    { value: "light", ariaLabel: "Light" },
    { value: "dark", ariaLabel: "Dark" },
  ]}
  bind:value={theme}
  variant="inverse"
  size="sm"
  ariaLabel="Theme"
/>
`

const segmentedSnippets: Record<Framework, string> = { react, vue, svelte }

export { segmentedSnippets }
