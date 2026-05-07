import { storybookLayout } from "@marwes-ui/core"
import { Spacing } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"

const meta = {
  title: "Layout/Atom/Spacing",
  component: Spacing,
  parameters: {
    ...storybookLayout.padded,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Spacing>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { args: {} }
export const Small: Story = { args: { size: "sp-8" } }
export const Medium: Story = { args: { size: "sp-24" } }
export const Large: Story = { args: { size: "sp-48" } }
export const ExtraLarge: Story = { args: { size: "sp-80" } }
