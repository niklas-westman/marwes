import { BadgeVariant, storybookLayout } from "@marwes-ui/core"
import { StatusBadge } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"

const meta: Meta<typeof StatusBadge> = {
  title: "Badge/Purpose/Status",
  component: StatusBadge,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: Object.values(BadgeVariant),
    },
  },
}

export default meta

type Story = StoryObj<typeof StatusBadge>

export const Default: Story = {
  args: { children: "Active", variant: BadgeVariant.success },
}

export const AllStatuses: Story = {
  args: { variant: BadgeVariant.success },
  argTypes: {
    children: { control: false, table: { disable: true } },
    id: { control: false, table: { disable: true } },
  },
  render: (args) => {
    const { children: _children, id: _id, ...sharedBadgeProps } = args

    return (
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          alignItems: "center",
        }}
      >
        <StatusBadge {...sharedBadgeProps}>Active</StatusBadge>
        <StatusBadge {...sharedBadgeProps}>Offline</StatusBadge>
        <StatusBadge {...sharedBadgeProps}>Degraded</StatusBadge>
        <StatusBadge {...sharedBadgeProps}>Unknown</StatusBadge>
      </div>
    )
  },
}
