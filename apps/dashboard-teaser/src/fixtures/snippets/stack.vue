<script setup lang="ts">
import { Paragraph, PrimaryButton, Stack, StackItem } from "@marwes-ui/vue"
</script>

<template>
  <Stack direction="row" gap="sp-16" padding="sp-24" align-items="center">
    <StackItem horizontal-sizing="fill">
      <Paragraph>Grows to fill the row</Paragraph>
    </StackItem>
    <StackItem>
      <PrimaryButton>Save</PrimaryButton>
    </StackItem>
  </Stack>
</template>
