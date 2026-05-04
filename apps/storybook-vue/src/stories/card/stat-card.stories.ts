import { storybookLayout } from "@marwes-ui/core"
import type { StatCardProps } from "@marwes-ui/vue"
import { StatCard } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

const meta = {
  title: "Card/Purpose/StatCard",
  component: StatCard as unknown as object,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
} satisfies Meta<StatCardProps>

export default meta
type Story = StoryObj<StatCardProps>

export const Default: Story = {
  render: () => ({
    components: { StatCard },
    template: `
      <StatCard>
        <template #title>Monthly recurring revenue</template>
        $128,400
      </StatCard>
    `,
  }),
}

export const MetricTile: Story = {
  render: () => ({
    components: { StatCard },
    template: `
      <StatCard
        value="42%"
        note="Estimated context-token reduction while preserving authority."
        meta="generation-6 candidate"
      >
        <template #title>Context reduction</template>
      </StatCard>
    `,
  }),
}
