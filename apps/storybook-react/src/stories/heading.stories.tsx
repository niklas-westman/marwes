import { H1, H2, H3, Paragraph } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"

const meta = {
  title: "Typography/Heading",
  component: H1,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof H1>

export default meta
type Story = StoryObj<typeof meta>

/**
 * H1 - Semantic top-level heading
 */
export const HeadingOne: Story = {
  render: () => <H1>This is a Heading 1</H1>,
}

/**
 * H2 - Semantic section heading
 */
export const HeadingTwo: Story = {
  render: () => <H2>This is a Heading 2</H2>,
}

/**
 * H3 - Semantic subsection heading
 */
export const HeadingThree: Story = {
  render: () => <H3>This is a Heading 3</H3>,
}

/**
 * All heading levels together
 */
export const AllLevels: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <H1>Heading 1 - Page Title</H1>
      <H2>Heading 2 - Section Title</H2>
      <H3>Heading 3 - Subsection Title</H3>
    </div>
  ),
}

/**
 * Size override example - H1 with H2 visual styling
 */
export const SizeOverride: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <H1>Normal H1 (h1 size)</H1>
      <H1 size="h2">H1 with h2 size (semantic h1, visual h2)</H1>
      <H1 size="h3">H1 with h3 size (semantic h1, visual h3)</H1>
    </div>
  ),
}

/**
 * With custom className
 */
export const WithCustomClass: Story = {
  render: () => (
    <H1 className="custom-class" style={{ color: "var(--mw-primary)" }}>
      Styled Heading
    </H1>
  ),
}

/**
 * With ID for anchor linking
 */
export const WithID: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <H1 id="introduction">Introduction</H1>
      <H2 id="getting-started">Getting Started</H2>
      <H3 id="installation">Installation</H3>
      <Paragraph>
        Use these IDs for anchor links: #introduction, #getting-started, #installation
      </Paragraph>
    </div>
  ),
}

/**
 * Long heading text
 */
export const LongText: Story = {
  render: () => (
    <div style={{ maxWidth: "600px" }}>
      <H1>
        This is a Very Long Heading That Might Wrap to Multiple Lines Depending on the Viewport
        Width
      </H1>
      <H2>This is also a long heading but at H2 level with different styling</H2>
    </div>
  ),
}

/**
 * Real-world content hierarchy
 */
export const ContentHierarchy: Story = {
  render: () => (
    <div style={{ maxWidth: "800px" }}>
      <H1>Design System Documentation</H1>
      <Paragraph style={{ marginTop: "16px", marginBottom: "32px" }}>
        A comprehensive guide to building with Marwes components.
      </Paragraph>

      <H2 style={{ marginTop: "32px" }}>Getting Started</H2>
      <Paragraph style={{ marginTop: "12px", marginBottom: "24px" }}>
        Learn how to set up and use the design system in your project.
      </Paragraph>

      <H3 style={{ marginTop: "24px" }}>Installation</H3>
      <Paragraph style={{ marginTop: "8px" }}>
        Install the required packages using your package manager.
      </Paragraph>

      <H3 style={{ marginTop: "24px" }}>Configuration</H3>
      <Paragraph style={{ marginTop: "8px" }}>
        Configure your theme and provider settings.
      </Paragraph>

      <H2 style={{ marginTop: "32px" }}>Components</H2>
      <Paragraph style={{ marginTop: "12px" }}>Explore the available component library.</Paragraph>
    </div>
  ),
}
