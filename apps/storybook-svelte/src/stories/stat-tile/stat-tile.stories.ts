import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { StatTile } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"

const meta = {
  title: "StatTile/Atom",
  component: StatTile,
  parameters: { ...storybookLayout.centered, ...storybookA11yPolicy.smoke },
  tags: ["autodocs"],
} satisfies Meta<typeof StatTile>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { label: "Revenue", value: "$12,345" },
}

export const WithTrend: Story = {
  args: { label: "Users", value: "1,234", trendValue: "+12%", trendDirection: "positive" },
}

export const Negative: Story = {
  args: {
    label: "Churn",
    value: "3.2%",
    trendValue: "-0.5%",
    trendDirection: "negative",
    tone: "danger",
  },
}

export const WithSubtitle: Story = {
  args: { label: "Revenue", value: "$12,345", subtitle: "Last 30 days" },
}
