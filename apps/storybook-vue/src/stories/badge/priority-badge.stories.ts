import { BadgeVariant, storybookLayout } from "@marwes-ui/core"
import type { PriorityBadgeProps } from "@marwes-ui/vue"
import { PriorityBadge } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

const VARIANTS = Object.values(BadgeVariant)

const meta = {
  title: "Badge/Purpose/Priority",
  component: PriorityBadge as unknown as object,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: VARIANTS,
    },
  },
} satisfies Meta<PriorityBadgeProps>

export default meta
type Story = StoryObj<PriorityBadgeProps>

export const Default: Story = {
  render: () => ({
    components: { PriorityBadge },
    setup() {
      return { BadgeVariant }
    },
    template: `<PriorityBadge :variant="BadgeVariant.warning">High</PriorityBadge>`,
  }),
}

export const AllPriorities: Story = {
  render: () => ({
    components: { PriorityBadge },
    setup() {
      return { BadgeVariant }
    },
    template: `
      <div style="display: flex; flex-wrap: wrap; gap: 8px; align-items: center;">
        <PriorityBadge :variant="BadgeVariant.error">Critical</PriorityBadge>
        <PriorityBadge :variant="BadgeVariant.warning">High</PriorityBadge>
        <PriorityBadge :variant="BadgeVariant.info">Medium</PriorityBadge>
        <PriorityBadge :variant="BadgeVariant.neutral">Low</PriorityBadge>
      </div>
    `,
  }),
}
