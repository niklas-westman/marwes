import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { StatCard } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"

const meta = {
  title: "Card/Purpose/StatCard",
  component: StatCard,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof StatCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: "Monthly recurring revenue",
    children: "$128,400",
  },
}
