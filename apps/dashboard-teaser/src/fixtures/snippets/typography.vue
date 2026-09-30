<script setup lang="ts">
import { H1, H2, H3, Paragraph, Text, TextVariant } from "@marwes-ui/vue"
</script>

<template>
  <Text :variant="TextVariant.display">Display</Text>

  <H1>Heading 1</H1>
  <H2>Heading 2</H2>
  <H3>Heading 3</H3>

  <Paragraph size="md">Body paragraph text.</Paragraph>
  <Paragraph size="sm">Small body paragraph.</Paragraph>

  <Text :variant="TextVariant.label">Label default</Text>
  <Text :variant="TextVariant.labelSmall">Label small</Text>
  <Text :variant="TextVariant.caption">Caption</Text>
  <Text :variant="TextVariant.overline">Overline</Text>
</template>
