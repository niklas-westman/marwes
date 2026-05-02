import { storybookLayout, storybookSpacingArgTypes } from "@marwes-ui/core"
import type { SpacingProps } from "@marwes-ui/react"
import { H1, Paragraph, Spacing, Spacings } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react-vite"

const panelBorder = "rgba(148, 163, 184, 0.35)"
const spacingHighlight = "rgba(14, 165, 233, 0.16)"

const spacerWrapStyle = {
  width: "100%",
  borderRadius: "12px",
  background: spacingHighlight,
  boxShadow: `inset 0 0 0 1px ${panelBorder}`,
  overflow: "hidden",
}

const meta = {
  title: "Spacing/Atom",
  component: Spacing,
  parameters: storybookLayout.padded,
  tags: ["autodocs"],
  argTypes: storybookSpacingArgTypes,
  args: {
    size: "sp-24",
  },
  render: (args: SpacingProps) => (
    <div style={spacerWrapStyle}>
      <Spacing {...args} />
    </div>
  ),
} satisfies Meta<typeof Spacing>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const ExtraSmall: Story = {
  args: { size: "sp-8" },
}

export const Small: Story = {
  args: { size: "sp-16" },
}

export const Large: Story = {
  args: { size: "sp-32" },
}

export const ExtraLarge: Story = {
  args: { size: "sp-40" },
}

/**
 * Full spacing scale from sp-0 to sp-120.
 */
export const AllSizes: Story = {
  render: () => (
    <div style={{ width: "600px" }}>
      {(
        [
          ["sp-0", "0px"],
          ["sp-2", "2px"],
          ["sp-4", "4px"],
          ["sp-8", "8px"],
          ["sp-16", "16px"],
          ["sp-24", "24px"],
          ["sp-32", "32px"],
          ["sp-40", "40px"],
          ["sp-48", "48px"],
          ["sp-56", "56px"],
          ["sp-64", "64px"],
          ["sp-72", "72px"],
          ["sp-80", "80px"],
          ["sp-88", "88px"],
          ["sp-96", "96px"],
          ["sp-104", "104px"],
          ["sp-112", "112px"],
          ["sp-120", "120px"],
        ] as const
      ).map(([size, pixels]) => (
        <div key={size}>
          <Paragraph>
            {size} ({pixels})
          </Paragraph>
          <div style={spacerWrapStyle}>
            <Spacing size={size} />
          </div>
        </div>
      ))}
    </div>
  ),
}

/**
 * Demonstrates `Spacings` const for token-driven usage without magic strings.
 */
export const InContext: Story = {
  render: () => (
    <div style={{ maxWidth: "600px" }}>
      <H1>This is a title</H1>
      <div style={spacerWrapStyle}>
        <Spacing size={Spacings["sp-24"]} />
      </div>
      <Paragraph>This is paragraph</Paragraph>
    </div>
  ),
}
