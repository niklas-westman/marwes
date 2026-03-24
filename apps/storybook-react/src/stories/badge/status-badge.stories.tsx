import { storybookLayout } from "@marwes-ui/core"
import { StatusBadge } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"

const meta: Meta<typeof StatusBadge> = {
  title: "Badge/Context/Status",
  component: StatusBadge,
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

type Story = StoryObj<typeof StatusBadge>

export const Default: Story = {
  args: { children: "Active", variant: "success" },
}

export const AllStatuses: Story = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
      <StatusBadge variant="success">Active</StatusBadge>
      <StatusBadge variant="error">Offline</StatusBadge>
      <StatusBadge variant="warning">Degraded</StatusBadge>
      <StatusBadge variant="neutral">Unknown</StatusBadge>
    </div>
  ),
}
