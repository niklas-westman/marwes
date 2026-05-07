import { storybookLayout } from "@marwes-ui/core"
import { Paragraph } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"

const meta = {
  title: "Paragraph/Atom",
  component: Paragraph,
  parameters: { ...storybookLayout.padded },
  tags: ["autodocs"],
} satisfies Meta<typeof Paragraph>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { args: { children: "Default body text paragraph." } }
export const Small: Story = { args: { children: "Small text for captions.", size: "sm" } }
export const Large: Story = { args: { children: "Large text for hero sections.", size: "lg" } }
