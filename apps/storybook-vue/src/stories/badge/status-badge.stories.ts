import { BadgeVariant, storybookLayout } from "@marwes-ui/core"
import type { StatusBadgeProps } from "@marwes-ui/vue"
import { StatusBadge } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

const VARIANTS = Object.values(BadgeVariant)

const meta = {
  title: "Badge/Purpose/Status",
  component: StatusBadge as unknown as object,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: VARIANTS,
    },
  },
} satisfies Meta<StatusBadgeProps>

export default meta
type Story = StoryObj<StatusBadgeProps>

export const Default: Story = {
  args: { variant: BadgeVariant.success },
  render: (args) => ({
    components: { StatusBadge },
    setup() {
      return { args }
    },
    template: `<StatusBadge v-bind="args">Active</StatusBadge>`,
  }),
}

export const AllStatuses: Story = {
  args: { variant: BadgeVariant.success },
  argTypes: {
    id: { control: false, table: { disable: true } },
  },
  render: (args) => ({
    components: { StatusBadge },
    setup() {
      return { args }
    },
    template: `
      <div style="display: flex; flex-wrap: wrap; gap: 8px; align-items: center;">
        <StatusBadge v-bind="args">Active</StatusBadge>
        <StatusBadge v-bind="args">Offline</StatusBadge>
        <StatusBadge v-bind="args">Degraded</StatusBadge>
        <StatusBadge v-bind="args">Unknown</StatusBadge>
      </div>
    `,
  }),
}
