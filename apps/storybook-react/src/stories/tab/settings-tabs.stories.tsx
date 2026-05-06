import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { SettingsTabs } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"

const meta: Meta<typeof SettingsTabs> = {
  title: "Tab/Purpose/SettingsTabs",
  component: SettingsTabs,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
  render: (args) => (
    <div style={{ width: "min(66vw, 540px)" }}>
      <SettingsTabs {...args} />
    </div>
  ),
}

export default meta

type Story = StoryObj<typeof SettingsTabs>

export const Default: Story = {
  args: {
    label: "Workspace settings",
    tabs: [
      { value: "general", label: "General", panel: "Name, locale, and workspace defaults." },
      {
        value: "notifications",
        label: "Notifications",
        panel: "Delivery channels, digests, and escalation rules.",
      },
      {
        value: "security",
        label: "Security",
        panel: "SSO, session controls, and audit retention.",
      },
    ],
    defaultActiveTab: "general",
  },
}
