import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { NavigationTabs } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"

const meta: Meta<typeof NavigationTabs> = {
  title: "Tab/Purpose/NavigationTabs",
  component: NavigationTabs,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
  render: (args) => (
    <div style={{ width: "min(66vw, 540px)" }}>
      <NavigationTabs {...args} />
    </div>
  ),
}

export default meta

type Story = StoryObj<typeof NavigationTabs>

export const Default: Story = {
  args: {
    label: "Primary navigation",
    tabs: [
      { value: "overview", label: "Overview", panel: "Key product summary and checkpoints." },
      { value: "roadmap", label: "Roadmap", panel: "Upcoming milestones and owners." },
      { value: "billing", label: "Billing", panel: "Invoices, usage, and plan details." },
    ],
    defaultActiveTab: "overview",
  },
}
