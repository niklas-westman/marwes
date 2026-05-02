import { BadgeVariant, storybookLayout } from "@marwes-ui/core"
import { NotificationBadge } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"

const VARIANTS = Object.values(BadgeVariant)

const meta: Meta<typeof NotificationBadge> = {
  title: "Badge/Purpose/Notification",
  component: NotificationBadge,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: VARIANTS,
    },
  },
}

export default meta

type Story = StoryObj<typeof NotificationBadge>

export const Default: Story = {
  args: { children: "5", variant: BadgeVariant.info, ariaLabel: "5 unread messages" },
}

export const AllNotifications: Story = {
  args: { variant: BadgeVariant.info, ariaLabel: "Unread notifications" },
  argTypes: {
    children: { control: false, table: { disable: true } },
    id: { control: false, table: { disable: true } },
  },
  render: (args) => {
    const { children: _children, id: _id, ...sharedBadgeProps } = args

    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
        <NotificationBadge {...sharedBadgeProps}>3</NotificationBadge>
        <NotificationBadge {...sharedBadgeProps}>99+</NotificationBadge>
      </div>
    )
  },
}
