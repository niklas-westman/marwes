import { BadgeVariant, storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { NotificationBadge } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"

const meta = {
  title: "Badge/Purpose/Notification",
  component: NotificationBadge,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: Object.values(BadgeVariant),
    },
  },
} satisfies Meta<typeof NotificationBadge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { children: "5", variant: BadgeVariant.info, ariaLabel: "5 unread messages" },
}
