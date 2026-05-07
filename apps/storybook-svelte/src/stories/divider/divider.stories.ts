import { storybookLayout } from "@marwes-ui/core"
import { Divider } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"

const meta = {
  title: "Layout/Atom/Divider",
  component: Divider,
  parameters: {
    ...storybookLayout.padded,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Divider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { args: {} }
export const ExtraSmall: Story = { args: { size: "xxs" } }
export const Small: Story = { args: { size: "sm" } }
export const Medium: Story = { args: { size: "md" } }
export const Large: Story = { args: { size: "lg" } }
export const Vertical: Story = { args: { orientation: "vertical" } }
