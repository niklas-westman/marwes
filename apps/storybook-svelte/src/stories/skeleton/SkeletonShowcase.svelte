<script lang="ts">
  import { H2, Paragraph, Skeleton } from "@marwes-ui/svelte"

  interface Props {
    showcase: "default" | "figma-shapes" | "loading-card" | "accessible-status"
  }

  const { showcase }: Props = $props()

  const stageStyle = "display: grid; gap: 1rem; width: min(720px, 100%);"
  const cardStyle = "display: grid; gap: 0.875rem; width: 320px; padding: 1rem; border-radius: 16px; border: 1px solid color-mix(in srgb, var(--mw-color-border) 72%, transparent); background: var(--mw-color-surface);"
</script>

{#if showcase === "figma-shapes"}
  <div style={stageStyle}>
    <Paragraph>Text — 120×12 / radius 4</Paragraph>
    <Skeleton variant="text" animation="none" />
    <Paragraph>Circular — 40×40 / radius 100</Paragraph>
    <Skeleton variant="circular" animation="none" />
    <Paragraph>Rectangular — 120×120 / radius 4</Paragraph>
    <Skeleton variant="rectangular" animation="none" />
  </div>
{:else if showcase === "loading-card"}
  <output style={cardStyle} aria-busy="true" aria-label="Loading account summary">
    <div style="display: flex; align-items: center; gap: 0.75rem;">
      <Skeleton variant="circular" width={48} height={48} />
      <div style="display: grid; gap: 0.5rem; flex: 1;">
        <Skeleton width="70%" height={12} />
        <Skeleton width="45%" height={12} />
      </div>
    </div>
    <Skeleton variant="rectangular" width="100%" height={120} radius={12} />
    <div style="display: grid; gap: 0.5rem;">
      <Skeleton width="92%" height={12} />
      <Skeleton width="78%" height={12} />
    </div>
  </output>
{:else if showcase === "accessible-status"}
  <div style={stageStyle}>
    <H2>Standalone loading region</H2>
    <Skeleton variant="rectangular" width={320} height={160} ariaLabel="Loading dashboard panel" />
  </div>
{/if}
