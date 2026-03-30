import { storybookLayout } from "@marwes-ui/core"
import { FeatureToggle } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"
import { createToggleableSwitchFieldRender } from "./story-helpers"

const meta: Meta<typeof FeatureToggle> = {
  title: "Switch/Purpose/FeatureToggle",
  component: FeatureToggle,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
}

export default meta

type Story = StoryObj<typeof FeatureToggle>

export const Default: Story = {
  args: {
    label: "Enable beta dashboard",
    description: "Turn on early access to the redesigned analytics experience.",
    switch: {
      checked: true,
    },
  },
  render: createToggleableSwitchFieldRender(FeatureToggle),
}

export const Controlled: Story = {
  render: () => {
    const [enabled, setEnabled] = React.useState(false)

    return (
      <div style={{ display: "grid", gap: 12 }}>
        <FeatureToggle
          label="AI assistant"
          description="Expose the assistant entry point throughout the app."
          switch={{ checked: enabled, onCheckedChange: setEnabled }}
        />
        <p style={{ fontSize: 14, color: "#6b7280" }}>
          Feature state: {enabled ? "enabled" : "disabled"}
        </p>
      </div>
    )
  },
}
