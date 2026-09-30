<script setup lang="ts">
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
