import { BadgeVariant, storybookLayout } from "@marwes-ui/core"
import type { NotificationBadgeProps } from "@marwes-ui/vue"
import { NotificationBadge } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

const VARIANTS = Object.values(BadgeVariant)

const meta = {
  title: "Badge/Purpose/Notification",
  component: NotificationBadge as unknown as object,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: VARIANTS,
    },
  },
} satisfies Meta<NotificationBadgeProps>

export default meta
type Story = StoryObj<NotificationBadgeProps>

export const Default: Story = {
  render: () => ({
    components: { NotificationBadge },
    setup() {
      return { BadgeVariant }
    },
    template: `<NotificationBadge :variant="BadgeVariant.info" ariaLabel="5 unread messages">5</NotificationBadge>`,
  }),
}

export const AllNotifications: Story = {
  render: () => ({
    components: { NotificationBadge },
    setup() {
      return { BadgeVariant }
    },
    template: `
      <div style="display: flex; flex-wrap: wrap; gap: 8px; align-items: center;">
        <NotificationBadge :variant="BadgeVariant.info" ariaLabel="3 new messages">3</NotificationBadge>
        <NotificationBadge :variant="BadgeVariant.error" ariaLabel="99+ alerts">99+</NotificationBadge>
      </div>
    `,
  }),
}
