<script setup lang="ts">
import { NavigationTabs } from "@marwes-ui/vue"

const tabs = [
  { value: "overview", label: "Overview", panel: "Account overview" },
  { value: "activity", label: "Activity", panel: "Recent account activity" },
]
</script>

<template>
  <NavigationTabs label="Account" :tabs="tabs" default-active-tab="overview" />
</template>
