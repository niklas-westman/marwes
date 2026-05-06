import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import type { CardProps } from "@marwes-ui/vue"
import { StatCard } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

const meta = {
  title: "Card/Purpose/StatCard",
  component: StatCard as unknown as object,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
} satisfies Meta<CardProps>

export default meta
type Story = StoryObj<CardProps>

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
