import { storybookLayout } from "@marwes-ui/core"
import { PreferenceSwitch } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"
import { createToggleableSwitchFieldRender } from "./story-helpers"

const meta: Meta<typeof PreferenceSwitch> = {
  title: "Switch/Purpose/Preference",
  component: PreferenceSwitch,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
}

export default meta

type Story = StoryObj<typeof PreferenceSwitch>

export const Default: Story = {
  args: {
    label: "Use compact layout",
    description: "Show denser spacing in tables, lists, and navigation.",
    switch: {
      checked: false,
    },
  },
  render: createToggleableSwitchFieldRender(PreferenceSwitch),
}

export const Controlled: Story = {
  render: () => {
    const [enabled, setEnabled] = React.useState(true)

    return (
      <div style={{ display: "grid", gap: 12 }}>
        <PreferenceSwitch
          label="Email me weekly summaries"
          description="Send a round-up every Friday with key activity from the week."
          switch={{ checked: enabled, onCheckedChange: setEnabled }}
        />
        <p style={{ fontSize: 14, color: "#6b7280" }}>
          Preference: {enabled ? "enabled" : "disabled"}
        </p>
      </div>
    )
  },
}
