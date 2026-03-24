import { storybookLayout } from "@marwes-ui/core"
import type { StatusBadgeProps } from "@marwes-ui/vue"
import { StatusBadge } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

const meta = {
  title: "Badge/Purpose/Status",
  component: StatusBadge as unknown as object,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["neutral", "brand", "info", "success", "warning", "error"],
    },
  },
} satisfies Meta<StatusBadgeProps>

export default meta
type Story = StoryObj<StatusBadgeProps>

export const Default: Story = {
  render: () => ({
    components: { StatusBadge },
    template: `<StatusBadge variant="success">Active</StatusBadge>`,
  }),
}

export const AllStatuses: Story = {
  render: () => ({
    components: { StatusBadge },
    template: `
      <div style="display: flex; flex-wrap: wrap; gap: 8px; align-items: center;">
        <StatusBadge variant="success">Active</StatusBadge>
        <StatusBadge variant="error">Offline</StatusBadge>
        <StatusBadge variant="warning">Degraded</StatusBadge>
        <StatusBadge variant="neutral">Unknown</StatusBadge>
      </div>
    `,
  }),
}
