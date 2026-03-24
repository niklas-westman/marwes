import { storybookLayout } from "@marwes-ui/core"
import type { NotificationBadgeProps } from "@marwes-ui/vue"
import { NotificationBadge } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

const meta = {
  title: "Badge/Context/Notification",
  component: NotificationBadge as unknown as object,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["neutral", "brand", "info", "success", "warning", "error"],
    },
  },
} satisfies Meta<NotificationBadgeProps>

export default meta
type Story = StoryObj<NotificationBadgeProps>

export const Default: Story = {
  render: () => ({
    components: { NotificationBadge },
    template: `<NotificationBadge variant="info" ariaLabel="5 unread messages">5</NotificationBadge>`,
  }),
}

export const AllNotifications: Story = {
  render: () => ({
    components: { NotificationBadge },
    template: `
      <div style="display: flex; flex-wrap: wrap; gap: 8px; align-items: center;">
        <NotificationBadge variant="info" ariaLabel="3 new messages">3</NotificationBadge>
        <NotificationBadge variant="brand">New</NotificationBadge>
        <NotificationBadge variant="error" ariaLabel="99+ alerts">99+</NotificationBadge>
      </div>
    `,
  }),
}
