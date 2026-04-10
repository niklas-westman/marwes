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
  args: { variant: BadgeVariant.info, ariaLabel: "5 unread messages" },
  render: (args) => ({
    components: { NotificationBadge },
    setup() {
      return { args }
    },
    template: `<NotificationBadge v-bind="args">5</NotificationBadge>`,
  }),
}

export const AllNotifications: Story = {
  args: { variant: BadgeVariant.info, ariaLabel: "Unread notifications" },
  argTypes: {
    id: { control: false, table: { disable: true } },
  },
  render: (args) => ({
    components: { NotificationBadge },
    setup() {
      return { args }
    },
    template: `
      <div style="display: flex; flex-wrap: wrap; gap: 8px; align-items: center;">
        <NotificationBadge v-bind="args">3</NotificationBadge>
        <NotificationBadge v-bind="args">99+</NotificationBadge>
      </div>
    `,
  }),
}
