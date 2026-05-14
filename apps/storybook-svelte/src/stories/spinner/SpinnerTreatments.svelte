<script lang="ts">
  import { Button, Paragraph, Spinner } from "@marwes-ui/svelte"

  interface Props {
    showcase: "button-loading" | "empty-state"
  }

  const { showcase }: Props = $props()
</script>

{#if showcase === "button-loading"}
  <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
    <Button variant="primary" action="submit" loading={true}>Loading…</Button>
    <Button variant="secondary" action="button" loading={true}>Please wait</Button>
  </div>
{:else if showcase === "empty-state"}
  <div style="display: inline-flex; align-items: center; justify-content: center; min-width: 320px; min-height: 220px; padding: 1.5rem; border-radius: 16px; background: #141414;">
    <div style="display: flex; flex-direction: column; align-items: center; gap: 0.75rem;">
      <Spinner variant="dots-round" size="lg" decorative style="--mw-spinner-indicator-color: #5859fc;" />
      <Paragraph size="sm" style="margin: 0; color: #f9fafb;">Loading your data</Paragraph>
      <Paragraph size="sm" style="margin: 0; color: #a3a3a3;">This matches the centered empty-state treatment from the Spinner page.</Paragraph>
    </div>
  </div>
{/if}
