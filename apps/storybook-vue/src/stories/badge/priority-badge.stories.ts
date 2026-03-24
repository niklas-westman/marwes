import { storybookLayout } from "@marwes-ui/core"
import type { PriorityBadgeProps } from "@marwes-ui/vue"
import { PriorityBadge } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

const meta = {
  title: "Badge/Purpose/Priority",
  component: PriorityBadge as unknown as object,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["neutral", "brand", "info", "success", "warning", "error"],
    },
  },
} satisfies Meta<PriorityBadgeProps>

export default meta
type Story = StoryObj<PriorityBadgeProps>

export const Default: Story = {
  render: () => ({
    components: { PriorityBadge },
    template: `<PriorityBadge variant="warning">High</PriorityBadge>`,
  }),
}

export const AllPriorities: Story = {
  render: () => ({
    components: { PriorityBadge },
    template: `
      <div style="display: flex; flex-wrap: wrap; gap: 8px; align-items: center;">
        <PriorityBadge variant="error">Critical</PriorityBadge>
        <PriorityBadge variant="warning">High</PriorityBadge>
        <PriorityBadge variant="info">Medium</PriorityBadge>
        <PriorityBadge variant="neutral">Low</PriorityBadge>
      </div>
    `,
  }),
}
