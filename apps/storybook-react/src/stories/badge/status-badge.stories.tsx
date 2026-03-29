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
  render: () => (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 8,
        alignItems: "center",
      }}
    >
      <StatusBadge variant={BadgeVariant.success}>Active</StatusBadge>
      <StatusBadge variant={BadgeVariant.error}>Offline</StatusBadge>
      <StatusBadge variant={BadgeVariant.warning}>Degraded</StatusBadge>
      <StatusBadge variant={BadgeVariant.neutral}>Unknown</StatusBadge>
    </div>
  ),
}
