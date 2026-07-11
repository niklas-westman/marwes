<script lang="ts">
  import { ProgressBar } from "@marwes-ui/svelte"

  interface Props {
    showcase: "states" | "hidden-label"
  }

  const { showcase }: Props = $props()

  const stackStyle = "display: grid; gap: 1.5rem; width: min(560px, 100%);"
  const rowStyle = "display: grid; grid-template-columns: 8rem minmax(15rem, 1fr); gap: 1.5rem; align-items: center;"
</script>

{#if showcase === "hidden-label"}
  <ProgressBar value={60} showLabel={false} ariaLabel="Progress" />
{:else}
  <div style={stackStyle}>
    <div style={rowStyle}><span>Default</span><ProgressBar label="Progress" value={60} /></div>
    <div style={rowStyle}><span>Hover</span><ProgressBar label="Progress" value={60} state="hover" /></div>
    <div style={rowStyle}><span>Pressed</span><ProgressBar label="Progress" value={60} state="pressed" /></div>
    <div style={rowStyle}><span>Disabled</span><ProgressBar label="Progress" value={60} disabled /></div>
    <div style={rowStyle}><span>Focus</span><ProgressBar label="Progress" value={60} state="focus" /></div>
  </div>
{/if}
