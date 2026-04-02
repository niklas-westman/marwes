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
    size: "md",
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
  args: { size: "xs" },
}

export const Small: Story = {
  args: { size: "sm" },
}

export const Large: Story = {
  args: { size: "lg" },
}

export const ExtraLarge: Story = {
  args: { size: "xl" },
}

/**
 * All 9 size variants from smallest (xxxs=2px) to largest (xxxl=56px).
 */
export const AllSizes: Story = {
  render: () => (
    <div style={{ width: "600px" }}>
      {(
        [
          ["xxxs", "2px"],
          ["xxs", "4px"],
          ["xs", "8px"],
          ["sm", "16px"],
          ["md", "24px"],
          ["lg", "32px"],
          ["xl", "40px"],
          ["xxl", "48px"],
          ["xxxl", "56px"],
          ["4xl", "64px"],
          ["5xl", "72px"],
          ["6xl", "80px"],
          ["7xl", "88px"],
          ["8xl", "96px"],
          ["9xl", "104px"],
          ["10xl", "112px"],
          ["11xl", "120px"],
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
        <Spacing size={Spacings.md} />
      </div>
      <Paragraph>This is paragraph</Paragraph>
    </div>
  ),
}
