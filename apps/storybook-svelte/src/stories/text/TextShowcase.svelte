<script lang="ts">
  import { Text } from "@marwes-ui/svelte";

  let { story }: { story: string } = $props();
</script>

{#if story === "label"}
  <Text variant="label">Field label</Text>
{:else if story === "label-small"}
  <Text variant="label-small">Compact label</Text>
{:else if story === "caption"}
  <Text variant="caption">Supporting caption</Text>
{:else if story === "overline"}
  <Text variant="overline">Section marker</Text>
{:else if story === "micro"}
  <Text variant="micro">Tiny metadata</Text>
{:else}
  <div style="display: grid; gap: 12px;">
    <Text variant="display">Display</Text>
    <Text variant="label">Label default</Text>
    <Text variant="label-small">Label small</Text>
    <Text variant="caption">Caption</Text>
    <Text variant="overline">Overline</Text>
    <Text variant="micro">Micro</Text>
  </div>
{/if}
