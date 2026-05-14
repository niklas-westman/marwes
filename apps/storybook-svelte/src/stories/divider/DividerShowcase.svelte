<script lang="ts">
  import { Divider, Paragraph } from "@marwes-ui/svelte"

  interface Props {
    showcase: "all-sizes" | "vertical-sizes" | "with-content" | "visual-hierarchy"
  }

  const { showcase }: Props = $props()

  const spacingHighlight = "rgba(14, 165, 233, 0.16)"
  const panelBorder = "rgba(148, 163, 184, 0.35)"
  const bandStyle = `width: 100%; border-radius: 12px; background: ${spacingHighlight}; box-shadow: inset 0 0 0 1px ${panelBorder};`
  const contentBlockStyle = `margin: 0; padding: 0.75rem 1rem; border-radius: 10px; background: rgba(255,255,255,0.96); box-shadow: inset 0 0 0 1px ${panelBorder};`

  const allSizes = [
    { size: "xxs" as const, label: "xxs (1px)" },
    { size: "xs" as const, label: "xs (8px)" },
    { size: "sm" as const, label: "sm (16px)" },
    { size: "md" as const, label: "md (32px)" },
    { size: "lg" as const, label: "lg (48px)" },
    { size: "xl" as const, label: "xl (64px)" },
    { size: "xxl" as const, label: "xxl (80px)" },
  ]
</script>

{#if showcase === "all-sizes"}
  <div style="width: 600px;">
    {#each allSizes as s}
      <Paragraph>{s.label}</Paragraph>
      <div style={bandStyle}><Divider size={s.size} /></div>
    {/each}
  </div>
{:else if showcase === "vertical-sizes"}
  <div style="display: flex; align-items: center; height: 140px; gap: 0; padding: 0 1rem; border-radius: 12px; background: {spacingHighlight}; box-shadow: inset 0 0 0 1px {panelBorder};">
    {#each allSizes as s}
      <p style={contentBlockStyle}>{s.size}</p>
      <Divider orientation="vertical" size={s.size} />
    {/each}
  </div>
{:else if showcase === "with-content"}
  <div style="max-width: 600px;">
    <h2 style="margin: 0 0 1rem 0;">Section One</h2>
    <Paragraph>This is the first section of content. It contains some introductory text.</Paragraph>
    <div style={bandStyle}><Divider size="sm" /></div>
    <h2 style="margin: 0 0 1rem 0;">Section Two</h2>
    <Paragraph>This is the second section. The divider visually separates it.</Paragraph>
    <div style={bandStyle}><Divider size="sm" /></div>
    <h2 style="margin: 0 0 1rem 0;">Section Three</h2>
    <Paragraph>Final section of content.</Paragraph>
  </div>
{:else if showcase === "visual-hierarchy"}
  <div style="max-width: 600px;">
    <h1 style="margin: 0 0 1rem 0;">Main Title</h1>
    <div style={bandStyle}><Divider size="lg" /></div>
    <h2 style="margin: 0 0 1rem 0;">Major Section</h2>
    <Paragraph>Content of the major section.</Paragraph>
    <div style={bandStyle}><Divider size="md" /></div>
    <h3 style="margin: 0 0 1rem 0;">Subsection</h3>
    <Paragraph>Content of the subsection.</Paragraph>
    <div style={bandStyle}><Divider size="sm" /></div>
    <Paragraph>Minor Point</Paragraph>
    <Paragraph>Minor details separated by a thin divider.</Paragraph>
    <div style={bandStyle}><Divider size="xxs" /></div>
  </div>
{/if}
