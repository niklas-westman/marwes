import { storybookLayout } from "@marwes-ui/core"
import { StatCard } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof StatCard> = {
  title: "Card/Purpose/StatCard",
  component: StatCard,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof StatCard>

export const Default: Story = {
  args: {
    title: "Monthly recurring revenue",
    children: "$128,400",
  },
}
