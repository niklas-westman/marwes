import { BadgeVariant, storybookLayout } from "@marwes-ui/core"
import { PriorityBadge } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"

const VARIANTS = Object.values(BadgeVariant)

const meta: Meta<typeof PriorityBadge> = {
  title: "Badge/Purpose/Priority",
  component: PriorityBadge,
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

type Story = StoryObj<typeof PriorityBadge>

export const Default: Story = {
  args: { children: "High", variant: BadgeVariant.warning },
}

export const AllPriorities: Story = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
      <PriorityBadge variant={BadgeVariant.error}>Critical</PriorityBadge>
      <PriorityBadge variant={BadgeVariant.warning}>High</PriorityBadge>
      <PriorityBadge variant={BadgeVariant.info}>Medium</PriorityBadge>
      <PriorityBadge variant={BadgeVariant.neutral}>Low</PriorityBadge>
    </div>
  ),
}
