<script lang="ts">
  import type { StackItemSizingOptions } from "@marwes-ui/core";
  import Stack from "../lib/components/stack/Stack.svelte";
  import StackItem from "../lib/components/stack/StackItem.svelte";

  type StackFixtureProps = StackItemSizingOptions & { mode: "list" | "nested" };

  let { mode, ...sizing }: StackFixtureProps = $props();
</script>

{#if mode === "list"}
  <Stack as="ul">
    <StackItem as="li">First</StackItem>
    <StackItem as="li">Second</StackItem>
  </Stack>
{:else}
  <Stack direction="row">
    <Stack {...sizing}>Nested</Stack>
    <StackItem>Item</StackItem>
  </Stack>
{/if}
