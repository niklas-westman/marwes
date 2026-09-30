<script setup lang="ts">
import { StatTile } from "@marwes-ui/vue"
</script>

<template>
  <StatTile
    label="Monthly revenue"
    value="$24,800"
    subtitle="Compared with last month"
    trend-value="12%"
    trend-direction="positive"
    tone="success"
  />
</template>
