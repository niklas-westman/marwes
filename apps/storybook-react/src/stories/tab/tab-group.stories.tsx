import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { TabGroup } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"

const accountTabs = [
  {
    value: "overview",
    label: "Overview",
    panel: "Workspace summary, recent activity, and linked resources.",
  },
  {
    value: "activity",
    label: "Activity",
    panel: "Recent edits, approvals, and delivery milestones.",
  },
  {
    value: "members",
    label: "Members",
    panel: "Roles, permissions, and collaborator access.",
  },
]

const meta: Meta<typeof TabGroup> = {
  title: "Tab/Molecule",
  component: TabGroup,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
  render: (args) => (
    <div style={{ width: "min(66vw, 540px)" }}>
      <TabGroup {...args} />
    </div>
  ),
}

export default meta

type Story = StoryObj<typeof TabGroup>

export const Playground: Story = {
  args: {
    label: "Workspace sections",
    tabs: accountTabs,
    defaultActiveTab: "overview",
  },
}

export const Controlled: Story = {
  render: () => {
    const [activeTab, setActiveTab] = React.useState("activity")

    return (
      <div style={{ display: "grid", gap: 12, width: "min(66vw, 540px)" }}>
        <TabGroup
          label="Account management"
          activeTab={activeTab}
          onActiveTabChange={setActiveTab}
          tabs={accountTabs}
        />
        <p style={{ color: "#6b7280", fontSize: 14 }}>Current tab: {activeTab}</p>
      </div>
    )
  },
}

export const WithDisabledTab: Story = {
  args: {
    label: "Release workflow",
    tabs: [
      {
        value: "draft",
        label: "Draft",
        panel: "Prepare copy, assets, and rollout notes.",
      },
      {
        value: "review",
        label: "Review",
        panel: "Collect approvals from design and product.",
        disabled: true,
      },
      {
        value: "publish",
        label: "Publish",
        panel: "Ship the release and notify subscribers.",
      },
    ],
    defaultActiveTab: "draft",
  },
}
