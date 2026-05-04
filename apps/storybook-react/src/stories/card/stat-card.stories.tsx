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

export const MetricTile: Story = {
  args: {
    title: "Context reduction",
    value: "42%",
    note: "Estimated context-token reduction while preserving authority.",
    meta: "generation-6 candidate",
  },
}
