import { Divider, H1, H2, H3, Paragraph } from "@marwes/react"
import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Atoms/Divider",
  component: Divider,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["xxs", "xs", "sm", "md", "lg", "xl", "xxl"],
      description: "Size variant (xxs=1px, xs=8px, sm=16px, md=32px, lg=48px, xl=64px, xxl=80px)",
    },
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
      description: "Orientation of the divider",
    },
  },
  args: {
    size: "md",
    orientation: "horizontal",
  },
} satisfies Meta<typeof Divider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Hairline: Story = {
  args: {
    size: "xxs",
  },
}

export const Small: Story = {
  args: {
    size: "sm",
  },
}

export const Large: Story = {
  args: {
    size: "lg",
  },
}

export const ExtraLarge: Story = {
  render: () => {
    return (
      <>
        {/* <Divider size="xxl" style={{ backgroundColor: colors.primary[500] }} /> investigate theme to import in adapter for easy color use in style */}
        <Divider size="xxl" />
      </>
    )
  },
}

/**
 * All horizontal size variants from smallest (xxs=1px) to largest (xxl=80px).
 * Demonstrates the full range of divider thicknesses based on Figma spec (node-id=1-932).
 */
export const AllSizes: Story = {
  render: () => (
    <div style={{ width: "600px" }}>
      <Paragraph>xxs (1px)</Paragraph>
      <Divider size="xxs" />

      <Paragraph>xs (8px)</Paragraph>
      <Divider size="xs" />

      <Paragraph>sm (16px)</Paragraph>
      <Divider size="sm" />

      <Paragraph>md (32px)</Paragraph>
      <Divider size="md" />

      <Paragraph>lg (48px)</Paragraph>
      <Divider size="lg" />

      <Paragraph>xl (64px)</Paragraph>
      <Divider size="xl" />

      <Paragraph>xxl (80px)</Paragraph>
      <Divider size="xxl" />
    </div>
  ),
}

/**
 * Vertical dividers for separating inline content.
 * Note: Vertical dividers require a flex or inline-block container.
 */
export const Vertical: Story = {
  args: {
    orientation: "vertical",
    size: "sm",
  },
  render: (args) => (
    <div style={{ display: "flex", alignItems: "center", height: "120px" }}>
      <Paragraph>Left content</Paragraph>
      <Divider {...args} />
      <Paragraph>Right content</Paragraph>
    </div>
  ),
}

/**
 * All vertical size variants in a horizontal layout.
 */
export const VerticalSizes: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        height: "120px",
        gap: "0",
      }}
    >
      <Paragraph>xxs</Paragraph>
      <Divider orientation="vertical" size="xxs" />

      <Paragraph>xs</Paragraph>
      <Divider orientation="vertical" size="xs" />

      <Paragraph>sm</Paragraph>
      <Divider orientation="vertical" size="sm" />

      <Paragraph>md</Paragraph>
      <Divider orientation="vertical" size="md" />

      <Paragraph>lg</Paragraph>
      <Divider orientation="vertical" size="lg" />

      <Paragraph>xl</Paragraph>
      <Divider orientation="vertical" size="xl" />

      <Paragraph>xxl</Paragraph>
      <Divider orientation="vertical" size="xxl" />
    </div>
  ),
}

/**
 * Dividers used to separate content sections in a typical layout.
 */
export const WithContent: Story = {
  render: () => (
    <div style={{ maxWidth: "600px" }}>
      <H2 style={{ margin: "0 0 1rem 0" }}>Section One</H2>
      <Paragraph style={{ margin: "0 0 1rem 0" }}>
        This is the first section of content. It contains some introductory text that explains the
        purpose of this section.
      </Paragraph>

      <Divider size="sm" />

      <H2 style={{ margin: "0 0 1rem 0" }}>Section Two</H2>
      <Paragraph style={{ margin: "0 0 1rem 0" }}>
        This is the second section. The divider above visually separates it from the previous
        content while maintaining semantic meaning.
      </Paragraph>

      <Divider size="sm" />

      <H2 style={{ margin: "0 0 1rem 0" }}>Section Three</H2>
      <Paragraph style={{ margin: "0" }}>
        Final section of content. Dividers help organize information and improve readability of
        long-form content.
      </Paragraph>
    </div>
  ),
}

/**
 * Using different divider sizes for visual hierarchy.
 */
export const VisualHierarchy: Story = {
  render: () => (
    <div style={{ maxWidth: "600px" }}>
      <H1 style={{ margin: "0 0 1rem 0" }}>Main Title</H1>
      <Divider size="lg" />

      <H2 style={{ margin: "0 0 1rem 0" }}>Major Section</H2>
      <Paragraph style={{ margin: "0 0 1rem 0" }}>Content of the major section.</Paragraph>
      <Divider size="md" />

      <H3 style={{ margin: "0 0 1rem 0" }}>Subsection</H3>
      <Paragraph style={{ margin: "0 0 1rem 0" }}>Content of the subsection.</Paragraph>
      <Divider size="sm" />

      <Paragraph style={{ margin: "0 0 1rem 0" }}>Minor Point</Paragraph>
      <Paragraph style={{ margin: "0" }}>Minor details separated by a thin divider.</Paragraph>
      <Divider size="xxs" />
    </div>
  ),
}
