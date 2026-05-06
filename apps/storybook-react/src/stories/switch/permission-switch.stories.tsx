import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { PermissionSwitch } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"
import { createToggleableSwitchFieldRender } from "./story-helpers"

const meta: Meta<typeof PermissionSwitch> = {
  title: "Switch/Purpose/Permission",
  component: PermissionSwitch,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
}

export default meta

type Story = StoryObj<typeof PermissionSwitch>

export const Default: Story = {
  args: {
    label: "Can publish content",
    description: "Allow this role to publish approved drafts to production.",
    switch: {
      checked: true,
    },
  },
  render: createToggleableSwitchFieldRender(PermissionSwitch),
}

export const Controlled: Story = {
  render: () => {
    const [enabled, setEnabled] = React.useState(false)

    return (
      <div style={{ display: "grid", gap: 12 }}>
        <PermissionSwitch
          label="Can manage billing"
          description="Grant access to invoices, payment methods, and plan changes."
          switch={{ checked: enabled, onCheckedChange: setEnabled }}
        />
        <p style={{ fontSize: 14, color: "#6b7280" }}>
          Permission: {enabled ? "granted" : "restricted"}
        </p>
      </div>
    )
  },
}
