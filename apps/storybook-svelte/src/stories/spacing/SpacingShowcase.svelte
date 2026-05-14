<script lang="ts">
  import { H1, Paragraph, Spacing } from "@marwes-ui/svelte"
  import { Spacings } from "@marwes-ui/core"

  interface Props {
    showcase: "all-sizes" | "in-context"
  }

  const { showcase }: Props = $props()

  const spacingHighlight = "rgba(14, 165, 233, 0.16)"
  const panelBorder = "rgba(148, 163, 184, 0.35)"
  const wrapStyle = `width: 100%; border-radius: 12px; background: ${spacingHighlight}; box-shadow: inset 0 0 0 1px ${panelBorder}; overflow: hidden;`

  const allSizes = [
    { size: "sp-0" as const, label: "0px" },
    { size: "sp-2" as const, label: "2px" },
    { size: "sp-4" as const, label: "4px" },
    { size: "sp-8" as const, label: "8px" },
    { size: "sp-16" as const, label: "16px" },
    { size: "sp-24" as const, label: "24px" },
    { size: "sp-32" as const, label: "32px" },
    { size: "sp-40" as const, label: "40px" },
    { size: "sp-48" as const, label: "48px" },
    { size: "sp-56" as const, label: "56px" },
    { size: "sp-64" as const, label: "64px" },
    { size: "sp-72" as const, label: "72px" },
    { size: "sp-80" as const, label: "80px" },
    { size: "sp-88" as const, label: "88px" },
    { size: "sp-96" as const, label: "96px" },
    { size: "sp-104" as const, label: "104px" },
    { size: "sp-112" as const, label: "112px" },
    { size: "sp-120" as const, label: "120px" },
  ]
</script>

{#if showcase === "all-sizes"}
  <div style="width: 600px;">
    {#each allSizes as s}
      <Paragraph>{s.size} ({s.label})</Paragraph>
      <div style={wrapStyle}><Spacing size={s.size} /></div>
    {/each}
  </div>
{:else if showcase === "in-context"}
  <div style="max-width: 600px;">
    <H1>This is a title</H1>
    <div style={wrapStyle}><Spacing size={Spacings["sp-24"]} /></div>
    <Paragraph>This is paragraph</Paragraph>
  </div>
{/if}
