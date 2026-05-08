<script lang="ts">
  import { Divider, H1, Paragraph } from "@marwes-ui/svelte"

  interface Props {
    showcase: "all-sizes" | "long-text" | "with-custom-class" | "article" | "multiple"
  }

  const { showcase }: Props = $props()
</script>

{#if showcase === "all-sizes"}
  <div style="display: flex; flex-direction: column;">
    <div>
      <Paragraph>Small (sm)</Paragraph>
      <Paragraph size="sm">This is a small paragraph. Use for footnotes, disclaimers, or secondary information.</Paragraph>
    </div>
    <Divider size="xs" />
    <div>
      <Paragraph>Medium (md) - Default</Paragraph>
      <Paragraph size="md">This is a medium paragraph. This is the default size for body text and standard content.</Paragraph>
    </div>
    <Divider size="xs" />
    <div>
      <Paragraph>Large (lg)</Paragraph>
      <Paragraph size="lg">This is a large paragraph. Use for lead paragraphs or emphasized content.</Paragraph>
    </div>
  </div>
{:else if showcase === "long-text"}
  <div style="max-width: 600px;">
    <Paragraph>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
      labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
      laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
      voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
      cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </Paragraph>
  </div>
{:else if showcase === "with-custom-class"}
  <Paragraph class="custom-paragraph" style="color: var(--mw-color-primary-base); font-style: italic;">
    This paragraph has custom styling applied.
  </Paragraph>
{:else if showcase === "article"}
  <div style="max-width: 800px;">
    <H1>Understanding Design Systems</H1>
    <Paragraph size="lg">
      A design system is a collection of reusable components, guided by clear standards, that can
      be assembled together to build any number of applications.
    </Paragraph>
    <Paragraph>
      Design systems enable teams to build better products faster by making design reusable.
    </Paragraph>
    <Paragraph>
      Components in a design system are like building blocks. Each component is designed to work
      well on its own, but they're even more powerful when combined.
    </Paragraph>
    <Paragraph size="sm">
      Note: This example demonstrates how different paragraph sizes can be used together to create
      visual hierarchy and improve readability in long-form content.
    </Paragraph>
  </div>
{:else if showcase === "multiple"}
  <div style="max-width: 600px;">
    <Paragraph style="margin-bottom: 16px;">
      First paragraph. This demonstrates how you might use multiple paragraphs in a real document.
    </Paragraph>
    <Paragraph style="margin-bottom: 16px;">
      Second paragraph. The components themselves don't include margin, which gives you full
      control over spacing in your layouts.
    </Paragraph>
    <Paragraph>
      Third paragraph. This approach follows the principle that components should be simple and composable.
    </Paragraph>
  </div>
{/if}
