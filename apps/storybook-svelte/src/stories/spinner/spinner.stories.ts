import { storybookLayout } from "@marwes-ui/core"
import { Spinner } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"

const meta = {
  title: "Feedback/Atom/Spinner",
  component: Spinner,
  parameters: {
    ...storybookLayout.centered,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Spinner>

export default meta
type Story = StoryObj<typeof meta>

export const Classic: Story = { args: { variant: "classic", size: "md" } }
export const Ring: Story = { args: { variant: "ring", size: "md" } }
export const Dual: Story = { args: { variant: "dual", size: "md" } }
export const DotsRound: Story = { args: { variant: "dots-round", size: "md" } }
export const DotsSquare: Story = { args: { variant: "dots-square", size: "md" } }
export const Lines: Story = { args: { variant: "lines", size: "md" } }
export const Cross: Story = { args: { variant: "cross", size: "md" } }
export const Small: Story = { args: { variant: "classic", size: "sm" } }
export const Large: Story = { args: { variant: "classic", size: "lg" } }
