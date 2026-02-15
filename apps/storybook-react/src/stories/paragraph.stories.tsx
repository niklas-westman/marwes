import { Divider, Paragraph } from "@marwes/react"
import { H1 } from "@marwes/react"
import type { Meta, StoryObj } from "@storybook/react"

const meta = {
  title: "Typography/Paragraph",
  component: Paragraph,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
} satisfies Meta<typeof Paragraph>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default paragraph (medium size)
 */
export const Default: Story = {
  args: {
    children:
      "This is a standard paragraph with medium size. It's the default size used for most body text in your application.",
  },
}

/**
 * Small paragraph
 */
export const Small: Story = {
  args: {
    size: "sm",
    children:
      "This is a small paragraph. Use this for secondary information, disclaimers, or less important text that needs to be de-emphasized.",
  },
}

/**
 * Medium paragraph (explicit)
 */
export const Medium: Story = {
  args: {
    size: "md",
    children:
      "This is a medium paragraph. This is the default size and is ideal for standard body text, descriptions, and general content.",
  },
}

/**
 * Large paragraph
 */
export const Large: Story = {
  args: {
    size: "lg",
    children:
      "This is a large paragraph. Use this for lead paragraphs, introductions, or text that needs more emphasis and better readability.",
  },
}

/**
 * All sizes together
 */
export const AllSizes: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div>
        <Paragraph style={{ display: "block" }}>Small (sm)</Paragraph>
        <Paragraph size="sm">
          This is a small paragraph. Use for footnotes, disclaimers, or secondary information.
        </Paragraph>
      </div>

      <Divider size="xs" />

      <div>
        <Paragraph style={{ display: "block" }}>Medium (md) - Default</Paragraph>
        <Paragraph size="md">
          This is a medium paragraph. This is the default size for body text and standard content.
        </Paragraph>
      </div>

      <Divider size="xs" />

      <div>
        <Paragraph style={{ display: "block" }}>Large (lg)</Paragraph>
        <Paragraph size="lg">
          This is a large paragraph. Use for lead paragraphs or emphasized content.
        </Paragraph>
      </div>
    </div>
  ),
}

/**
 * Long text content
 */
export const LongText: Story = {
  render: () => (
    <div style={{ maxWidth: "600px" }}>
      <Paragraph>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
        laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
        voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
        cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </Paragraph>
    </div>
  ),
}

/**
 * With custom className
 */
export const WithCustomClass: Story = {
  args: {
    children: "This paragraph has custom styling applied.",
    className: "custom-paragraph",
  },
  render: (args) => (
    <Paragraph {...args} style={{ color: "var(--mw-primary)", fontStyle: "italic" }} />
  ),
}

/**
 * Real-world article example
 */
export const ArticleExample: Story = {
  render: () => (
    <div style={{ maxWidth: "800px" }}>
      <H1 style={{ marginBottom: "16px" }}>Understanding Design Systems</H1>

      <Paragraph size="lg" style={{ marginBottom: "24px" }}>
        A design system is a collection of reusable components, guided by clear standards, that can
        be assembled together to build any number of applications.
      </Paragraph>

      <Paragraph style={{ marginBottom: "16px" }}>
        Design systems enable teams to build better products faster by making design reusable.
        Rather than reinventing the wheel every time a new feature is needed, teams can leverage
        pre-built components that follow established patterns and guidelines.
      </Paragraph>

      <Paragraph style={{ marginBottom: "16px" }}>
        Components in a design system are like building blocks. Each component is designed to work
        well on its own, but they're even more powerful when combined. This modular approach allows
        for consistent user experiences across different products and platforms.
      </Paragraph>

      <Paragraph size="sm" style={{ marginTop: "32px" }}>
        Note: This example demonstrates how different paragraph sizes can be used together to create
        visual hierarchy and improve readability in long-form content.
      </Paragraph>
    </div>
  ),
}

/**
 * Multiple paragraphs with spacing
 */
export const MultipleParagraphs: Story = {
  render: () => (
    <div style={{ maxWidth: "600px" }}>
      <Paragraph style={{ marginBottom: "16px" }}>
        First paragraph. This demonstrates how you might use multiple paragraphs in a real document.
        Note that spacing is controlled by the user.
      </Paragraph>

      <Paragraph style={{ marginBottom: "16px" }}>
        Second paragraph. The components themselves don't include margin, which gives you full
        control over spacing in your layouts.
      </Paragraph>

      <Paragraph>
        Third paragraph. This approach follows the principle that components should be simple and
        composable, letting you decide how they fit together.
      </Paragraph>
    </div>
  ),
}
