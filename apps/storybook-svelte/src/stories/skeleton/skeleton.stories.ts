import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { Skeleton } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"

const meta = {
  title: "Skeleton/Atom",
  component: Skeleton,
  parameters: { ...storybookLayout.centered, ...storybookA11yPolicy.smoke },
  tags: ["autodocs"],
} satisfies Meta<typeof Skeleton>

export default meta
type Story = StoryObj<typeof meta>

export const Text: Story = { args: { variant: "text" } }
export const Circular: Story = { args: { variant: "circular" } }
export const Rectangular: Story = { args: { variant: "rectangular" } }
export const Wave: Story = { args: { variant: "text", animation: "wave" } }
export const NoAnimation: Story = { args: { variant: "text", animation: "none" } }
export const CustomSize: Story = { args: { variant: "rectangular", width: 200, height: 100 } }
