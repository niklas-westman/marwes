<script lang="ts">
  import { H1, H2, H3, Paragraph } from "@marwes-ui/svelte"

  interface Props {
    story?: "all-levels" | "size-override" | "heading-two" | "heading-three" | "long-text" | "with-custom-class" | "with-id" | "content-hierarchy"
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
    <H1 size="h2">H1 with h2 size (semantic h1, visual h2)</H1>
    <H1 size="h3">H1 with h3 size (semantic h1, visual h3)</H1>
  </div>
{:else if story === "heading-two"}
  <H2>This is a Heading 2</H2>
{:else if story === "heading-three"}
  <H3>This is a Heading 3</H3>
{:else if story === "long-text"}
  <div style="max-width: 600px;">
    <H1>This is a Very Long Heading That Might Wrap to Multiple Lines Depending on the Viewport Width</H1>
    <H2>This is also a long heading but at H2 level with different styling</H2>
  </div>
{:else if story === "with-custom-class"}
  <H1 class="custom-class" style="color: var(--mw-color-primary-base);">Styled Heading</H1>
{:else if story === "with-id"}
  <div style="display: flex; flex-direction: column; gap: 16px;">
    <H1 id="introduction">Introduction</H1>
    <H2 id="getting-started">Getting Started</H2>
    <H3 id="installation">Installation</H3>
    <Paragraph>Use these IDs for anchor links: #introduction, #getting-started, #installation</Paragraph>
  </div>
{:else if story === "content-hierarchy"}
  <div style="max-width: 800px;">
    <H1>Design System Documentation</H1>
    <Paragraph>A comprehensive guide to building with Marwes components.</Paragraph>
    <H2>Getting Started</H2>
    <Paragraph>Learn how to set up and use the design system in your project.</Paragraph>
    <H3>Installation</H3>
    <Paragraph>Install the required packages using your package manager.</Paragraph>
    <H3>Configuration</H3>
    <Paragraph>Configure your theme and provider settings.</Paragraph>
    <H2>Components</H2>
    <Paragraph>Explore the available component library.</Paragraph>
  </div>
{/if}
