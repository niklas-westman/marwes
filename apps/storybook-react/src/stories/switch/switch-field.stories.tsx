import { storybookLayout } from "@marwes-ui/core"
import { SwitchField } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"

const meta: Meta<typeof SwitchField> = {
  title: "Switch/Molecule",
  component: SwitchField,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
}

export default meta

type Story = StoryObj<typeof SwitchField>

export const Playground: Story = {
  args: {
    label: "Enable notifications",
    description: "Receive important account and product updates.",
    switch: {
      checked: false,
    },
  },
}

export const Controlled: Story = {
  render: () => {
    const [enabled, setEnabled] = React.useState(true)

    return (
      <div style={{ display: "grid", gap: 12 }}>
        <SwitchField
          label="Enable desktop notifications"
          description="Show a notification banner when background events need attention."
          switch={{ checked: enabled, onCheckedChange: setEnabled }}
        />
        <p style={{ fontSize: 14, color: "#6b7280" }}>Current value: {enabled ? "on" : "off"}</p>
      </div>
    )
  },
}

export const WithError: Story = {
  args: {
    label: "Require approval before publishing",
    error: "Review mode must stay enabled for this workspace.",
    switch: {
      checked: false,
    },
  },
}

export const Disabled: Story = {
  args: {
    label: "Automatic backups",
    description: "This setting is managed by your organization.",
    switch: {
      checked: true,
      disabled: true,
    },
  },
}
