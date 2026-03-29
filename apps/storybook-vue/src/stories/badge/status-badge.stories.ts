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
  render: () => ({
    components: { StatusBadge },
    setup() {
      return { BadgeVariant }
    },
    template: `<StatusBadge :variant="BadgeVariant.success">Active</StatusBadge>`,
  }),
}

export const AllStatuses: Story = {
  render: () => ({
    components: { StatusBadge },
    setup() {
      return { BadgeVariant }
    },
    template: `
      <div style="display: flex; flex-wrap: wrap; gap: 8px; align-items: center;">
        <StatusBadge :variant="BadgeVariant.success">Active</StatusBadge>
        <StatusBadge :variant="BadgeVariant.error">Offline</StatusBadge>
        <StatusBadge :variant="BadgeVariant.warning">Degraded</StatusBadge>
        <StatusBadge :variant="BadgeVariant.neutral">Unknown</StatusBadge>
      </div>
    `,
  }),
}
