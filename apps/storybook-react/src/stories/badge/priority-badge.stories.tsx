import { BadgeVariant, storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { PriorityBadge } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"

const VARIANTS = Object.values(BadgeVariant)

const meta: Meta<typeof PriorityBadge> = {
  title: "Badge/Purpose/Priority",
  component: PriorityBadge,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: VARIANTS,
    },
  },
}

export default meta

type Story = StoryObj<typeof PriorityBadge>

export const Default: Story = {
  args: { children: "High", variant: BadgeVariant.warning },
}

export const AllPriorities: Story = {
  args: { variant: BadgeVariant.warning },
  argTypes: {
    children: { control: false, table: { disable: true } },
    id: { control: false, table: { disable: true } },
  },
  render: (args) => {
    const { children: _children, id: _id, ...sharedBadgeProps } = args

    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
        <PriorityBadge {...sharedBadgeProps}>Critical</PriorityBadge>
        <PriorityBadge {...sharedBadgeProps}>High</PriorityBadge>
        <PriorityBadge {...sharedBadgeProps}>Medium</PriorityBadge>
        <PriorityBadge {...sharedBadgeProps}>Low</PriorityBadge>
      </div>
    )
  },
}
