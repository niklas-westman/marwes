import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { Tab } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"

const meta: Meta<typeof Tab> = {
  title: "Tab/Atom",
  component: Tab,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
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

function AtomTabPreview(args: React.ComponentProps<typeof Tab>) {
  const generatedPanelId = React.useId()
  const panelId = args.ariaControls ?? generatedPanelId

  return (
    <div>
      <div role="tablist" aria-label="Example tab">
        <Tab {...args} ariaControls={panelId} />
      </div>
      <div id={panelId} role="tabpanel" aria-label="Example tab panel" hidden={!args.selected} />
    </div>
  )
}

export const Default: Story = {
  args: { children: "Overview" },
  render: (args) => <AtomTabPreview {...args} />,
}

export const Selected: Story = {
  args: { children: "Overview", selected: true },
  render: (args) => <AtomTabPreview {...args} />,
}

export const Disabled: Story = {
  args: { children: "Settings", disabled: true },
  render: (args) => <AtomTabPreview {...args} />,
}

export const IconOnly: Story = {
  args: {
    children: <span aria-hidden="true">⚙️</span>,
    ariaLabel: "Settings",
    ariaControls: "panel-settings",
  },
  render: (args) => <AtomTabPreview {...args} />,
}

export const TabBar: Story = {
  render: () => {
    const [active, setActive] = React.useState(0)
    const tabs = ["Overview", "Activity", "Settings"]

    return (
      <div>
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
        {tabs.map((label, i) => (
          <div key={label} id={`panel-${i}`} role="tabpanel" hidden={active !== i}>
            {label}
          </div>
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
        <AtomTabPreview>Overview</AtomTabPreview>
      </div>
      <div>
        <p style={{ marginBottom: 8, fontSize: 12, color: "#6b7280" }}>Selected</p>
        <AtomTabPreview selected>Overview</AtomTabPreview>
      </div>
      <div>
        <p style={{ marginBottom: 8, fontSize: 12, color: "#6b7280" }}>Disabled</p>
        <AtomTabPreview disabled>Settings</AtomTabPreview>
      </div>
      <div>
        <p style={{ marginBottom: 8, fontSize: 12, color: "#6b7280" }}>Tab bar</p>
        <div role="tablist" style={{ display: "flex", borderBottom: "1px solid #e5e7eb" }}>
          <Tab selected ariaControls="panel-0">
            Overview
          </Tab>
          <Tab ariaControls="panel-1">Activity</Tab>
          <Tab disabled ariaControls="panel-2">
            Settings
          </Tab>
        </div>
        <div id="panel-0" role="tabpanel">
          Overview
        </div>
        <div id="panel-1" role="tabpanel" hidden>
          Activity
        </div>
        <div id="panel-2" role="tabpanel" hidden>
          Settings
        </div>
      </div>
    </div>
  ),
}
