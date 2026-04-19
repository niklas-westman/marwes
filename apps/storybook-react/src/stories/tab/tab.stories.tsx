import { storybookLayout } from "@marwes-ui/core"
import { Tab } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"

const meta: Meta<typeof Tab> = {
  title: "Tab/Atom",
  component: Tab,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
  argTypes: {
    selected: { control: "boolean" },
    disabled: { control: "boolean" },
    ariaLabel: { control: "text" },
    ariaControls: { control: "text" },
  },
}

export default meta

type Story = StoryObj<typeof Tab>

export const Default: Story = {
  args: { children: "Overview" },
}

export const Selected: Story = {
  args: { children: "Overview", selected: true },
}

export const Disabled: Story = {
  args: { children: "Settings", disabled: true },
}

export const IconOnly: Story = {
  args: {
    children: <span aria-hidden="true">⚙️</span>,
    ariaLabel: "Settings",
    ariaControls: "panel-settings",
  },
}

export const TabList: Story = {
  render: () => {
    const [active, setActive] = React.useState(0)
    const tabs = ["Overview", "Activity", "Settings"]

    return (
      <div
        role="tablist"
        aria-label="Example tabs"
        style={{ display: "flex", borderBottom: "1px solid #e5e7eb" }}
      >
        {tabs.map((label, i) => (
          <Tab
            key={label}
            selected={active === i}
            ariaControls={`panel-${i}`}
            onClick={() => setActive(i)}
          >
            {label}
          </Tab>
        ))}
      </div>
    )
  },
}

export const AllStates: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <p style={{ marginBottom: 8, fontSize: 12, color: "#6b7280" }}>Default / Inactive</p>
        <Tab>Overview</Tab>
      </div>
      <div>
        <p style={{ marginBottom: 8, fontSize: 12, color: "#6b7280" }}>Selected</p>
        <Tab selected>Overview</Tab>
      </div>
      <div>
        <p style={{ marginBottom: 8, fontSize: 12, color: "#6b7280" }}>Disabled</p>
        <Tab disabled>Settings</Tab>
      </div>
      <div>
        <p style={{ marginBottom: 8, fontSize: 12, color: "#6b7280" }}>Tab row</p>
        <div role="tablist" style={{ display: "flex", borderBottom: "1px solid #e5e7eb" }}>
          <Tab selected ariaControls="panel-0">
            Overview
          </Tab>
          <Tab ariaControls="panel-1">Activity</Tab>
          <Tab disabled ariaControls="panel-2">
            Settings
          </Tab>
        </div>
      </div>
    </div>
  ),
}
