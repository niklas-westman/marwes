<script lang="ts">
  import { H1, H2, H3 } from "@marwes-ui/svelte"

  interface Props {
    story?: "all-levels" | "size-override"
  }

  let { story = "all-levels" }: Props = $props()
</script>

{#if story === "all-levels"}
  <div style="display: flex; flex-direction: column; gap: 24px;">
    <H1>Heading 1 - Page Title</H1>
    <H2>Heading 2 - Section Title</H2>
    <H3>Heading 3 - Subsection Title</H3>
  </div>
{:else if story === "size-override"}
  <div style="display: flex; flex-direction: column; gap: 16px;">
    <H1>Normal H1 (h1 size)</H1>
    <H1 size="h2">H1 with h2 size</H1>
    <H1 size="h3">H1 with h3 size</H1>
  </div>
{/if}
