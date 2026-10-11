import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import type { StackItemProps } from "@marwes-ui/react"
import { Stack, StackItem, stackSizings } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import type * as React from "react"

// Demo-only chrome: the outline and tint make the item's box visible.
const frameStyle: React.CSSProperties = {
  width: "520px",
  borderRadius: "12px",
  boxShadow: "inset 0 0 0 1px rgba(148, 163, 184, 0.6)",
}

const boxStyle: React.CSSProperties = {
  padding: "8px 12px",
  borderRadius: "8px",
  background: "rgba(14, 165, 233, 0.16)",
}

const meta = {
  title: "Stack/Item",
  component: StackItem,
  parameters: {
    ...storybookLayout.padded,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
  argTypes: {
    horizontalSizing: { control: "inline-radio", options: [...stackSizings] },
    verticalSizing: { control: "inline-radio", options: [...stackSizings] },
  },
  args: {
    horizontalSizing: "hug",
    verticalSizing: "hug",
  },
  render: (args: StackItemProps) => (
    <div style={frameStyle}>
      <Stack direction="row" gap="sp-12" padding="sp-12">
        <StackItem {...args}>
          <div style={boxStyle}>Controlled item</div>
        </StackItem>
        <StackItem>
          <div style={{ ...boxStyle, minHeight: "72px" }}>Sibling</div>
        </StackItem>
      </Stack>
    </div>
  ),
} satisfies Meta<typeof StackItem>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Fill: Story = {
  args: { horizontalSizing: "fill", verticalSizing: "fill" },
}

export const ListItems: Story = {
  render: () => (
    <div style={frameStyle}>
      <Stack as="ul" gap="sp-8" padding="sp-12" aria-label="Publishing steps">
        {["Draft", "Review", "Publish"].map((step) => (
          <StackItem as="li" key={step} horizontalSizing="fill">
            <div style={boxStyle}>{step}</div>
          </StackItem>
        ))}
      </Stack>
    </div>
  ),
}
