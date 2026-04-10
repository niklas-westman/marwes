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
  args: { variant: BadgeVariant.warning },
  render: (args) => ({
    components: { PriorityBadge },
    setup() {
      return { args }
    },
    template: `<PriorityBadge v-bind="args">High</PriorityBadge>`,
  }),
}

export const AllPriorities: Story = {
  args: { variant: BadgeVariant.warning },
  argTypes: {
    id: { control: false, table: { disable: true } },
  },
  render: (args) => ({
    components: { PriorityBadge },
    setup() {
      return { args }
    },
    template: `
      <div style="display: flex; flex-wrap: wrap; gap: 8px; align-items: center;">
        <PriorityBadge v-bind="args">Critical</PriorityBadge>
        <PriorityBadge v-bind="args">High</PriorityBadge>
        <PriorityBadge v-bind="args">Medium</PriorityBadge>
        <PriorityBadge v-bind="args">Low</PriorityBadge>
      </div>
    `,
  }),
}
