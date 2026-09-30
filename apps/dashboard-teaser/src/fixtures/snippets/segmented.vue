<script setup lang="ts">
import { h } from "vue"
import { Icon, IconName, SegmentedControlField } from "@marwes-ui/vue"

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
  <SegmentedControlField
    label="View density"
    :segmented-control="{ items: [
      { value: 'compact', label: 'Compact' },
      { value: 'wide', label: 'Wide' },
    ], variant: 'inverse', fullWidth: true }"
  />
  <SegmentedControlField label="View mode" :segmented-control="{ items: modeItems, variant: 'inverse', fullWidth: true }" />
  <SegmentedControlField label="Theme" :segmented-control="{ items: themeItems, variant: 'inverse', size: 'sm' }" />
</template>
