import { storybookLayout } from "@marwes-ui/core"
import { PriorityBadge } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"

const meta: Meta<typeof PriorityBadge> = {
  title: "Badge/Purpose/Priority",
  component: PriorityBadge,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["neutral", "brand", "info", "success", "warning", "error"],
    },
  },
}

export default meta

type Story = StoryObj<typeof PriorityBadge>

export const Default: Story = {
  args: { children: "High", variant: "warning" },
}

export const AllPriorities: Story = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
      <PriorityBadge variant="error">Critical</PriorityBadge>
      <PriorityBadge variant="warning">High</PriorityBadge>
      <PriorityBadge variant="info">Medium</PriorityBadge>
      <PriorityBadge variant="neutral">Low</PriorityBadge>
    </div>
  ),
}
