<script setup lang="ts">
import { PaginationField } from "@marwes-ui/vue"
</script>

<template>
  <PaginationField
    label="Search results"
    :pagination="{
      defaultPage: 1,
      pageCount: 10,
      controlDisplay: 'label',
      maxVisibleItems: 5,
    }"
  />
</template>
