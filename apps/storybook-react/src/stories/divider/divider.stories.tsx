import { storybookDividerArgTypes, storybookLayout } from "@marwes-ui/core"
import type { DividerProps } from "@marwes-ui/react"
import { Divider, H1, H2, H3, Paragraph } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react-vite"

const spacingHighlight = "rgba(14, 165, 233, 0.16)"
const panelBorder = "rgba(148, 163, 184, 0.35)"

const horizontalBandStyle = {
  width: "100%",
  borderRadius: "12px",
  background: spacingHighlight,
  boxShadow: `inset 0 0 0 1px ${panelBorder}`,
}

const contentBlockStyle = {
  margin: 0,
  padding: "0.75rem 1rem",
  borderRadius: "10px",
  background: "rgba(255, 255, 255, 0.96)",
  boxShadow: `inset 0 0 0 1px ${panelBorder}`,
}

function DividerPreview(args: DividerProps) {
  if (args.orientation === "vertical") {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          height: "140px",
          padding: "0 1rem",
          borderRadius: "12px",
          background: spacingHighlight,
          boxShadow: `inset 0 0 0 1px ${panelBorder}`,
        }}
      >
        <Paragraph style={contentBlockStyle}>Left content</Paragraph>
        <Divider {...args} />
        <Paragraph style={contentBlockStyle}>Right content</Paragraph>
      </div>
    )
  }

  return (
    <div style={horizontalBandStyle}>
      <Divider {...args} />
    </div>
  )
}

const meta = {
  title: "Divider/Atom",
  component: Divider,
  parameters: storybookLayout.padded,
  tags: ["autodocs"],
  argTypes: storybookDividerArgTypes,
  args: {
    size: "md",
    orientation: "horizontal",
  },
  render: (args) => <DividerPreview {...args} />,
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
  args: {
    size: "xxl",
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
      <div style={horizontalBandStyle}>
        <Divider size="xxs" />
      </div>

      <Paragraph>xs (8px)</Paragraph>
      <div style={horizontalBandStyle}>
        <Divider size="xs" />
      </div>

      <Paragraph>sm (16px)</Paragraph>
      <div style={horizontalBandStyle}>
        <Divider size="sm" />
      </div>

      <Paragraph>md (32px)</Paragraph>
      <div style={horizontalBandStyle}>
        <Divider size="md" />
      </div>

      <Paragraph>lg (48px)</Paragraph>
      <div style={horizontalBandStyle}>
        <Divider size="lg" />
      </div>

      <Paragraph>xl (64px)</Paragraph>
      <div style={horizontalBandStyle}>
        <Divider size="xl" />
      </div>

      <Paragraph>xxl (80px)</Paragraph>
      <div style={horizontalBandStyle}>
        <Divider size="xxl" />
      </div>
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
        height: "140px",
        gap: "0",
        padding: "0 1rem",
        borderRadius: "12px",
        background: spacingHighlight,
        boxShadow: `inset 0 0 0 1px ${panelBorder}`,
      }}
    >
      <Paragraph style={contentBlockStyle}>xxs</Paragraph>
      <Divider orientation="vertical" size="xxs" />

      <Paragraph style={contentBlockStyle}>xs</Paragraph>
      <Divider orientation="vertical" size="xs" />

      <Paragraph style={contentBlockStyle}>sm</Paragraph>
      <Divider orientation="vertical" size="sm" />

      <Paragraph style={contentBlockStyle}>md</Paragraph>
      <Divider orientation="vertical" size="md" />

      <Paragraph style={contentBlockStyle}>lg</Paragraph>
      <Divider orientation="vertical" size="lg" />

      <Paragraph style={contentBlockStyle}>xl</Paragraph>
      <Divider orientation="vertical" size="xl" />

      <Paragraph style={contentBlockStyle}>xxl</Paragraph>
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

      <div style={horizontalBandStyle}>
        <Divider size="sm" />
      </div>

      <H2 style={{ margin: "0 0 1rem 0" }}>Section Two</H2>
      <Paragraph style={{ margin: "0 0 1rem 0" }}>
        This is the second section. The divider above visually separates it from the previous
        content while maintaining semantic meaning.
      </Paragraph>

      <div style={horizontalBandStyle}>
        <Divider size="sm" />
      </div>

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
      <div style={horizontalBandStyle}>
        <Divider size="lg" />
      </div>

      <H2 style={{ margin: "0 0 1rem 0" }}>Major Section</H2>
      <Paragraph style={{ margin: "0 0 1rem 0" }}>Content of the major section.</Paragraph>
      <div style={horizontalBandStyle}>
        <Divider size="md" />
      </div>

      <H3 style={{ margin: "0 0 1rem 0" }}>Subsection</H3>
      <Paragraph style={{ margin: "0 0 1rem 0" }}>Content of the subsection.</Paragraph>
      <div style={horizontalBandStyle}>
        <Divider size="sm" />
      </div>

      <Paragraph style={{ margin: "0 0 1rem 0" }}>Minor Point</Paragraph>
      <Paragraph style={{ margin: "0" }}>Minor details separated by a thin divider.</Paragraph>
      <div style={horizontalBandStyle}>
        <Divider size="xxs" />
      </div>
    </div>
  ),
}
