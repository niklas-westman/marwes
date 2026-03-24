import { storybookLayout } from "@marwes-ui/core"
import { YesNoRadioGroup } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"

const meta: Meta<typeof YesNoRadioGroup> = {
  title: "Radio/Context/YesNo",
  component: YesNoRadioGroup,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
}

export default meta

type Story = StoryObj<typeof YesNoRadioGroup>

export const Default: Story = {
  args: {
    name: "accept",
    label: "Do you accept the terms?",
  },
}

export const CustomLabels: Story = {
  args: {
    name: "newsletter",
    label: "Subscribe to newsletter?",
    yesLabel: "Subscribe",
    noLabel: "No thanks",
  },
}

export const WithError: Story = {
  args: {
    name: "accept",
    label: "Do you accept the terms?",
    error: "You must make a selection.",
  },
}

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = React.useState("")
    return (
      <div style={{ display: "grid", gap: 12 }}>
        <YesNoRadioGroup
          name="accept"
          label="Accept terms?"
          {...(value ? { value, onChange: setValue } : { onChange: setValue })}
        />
        <p style={{ fontSize: 14, color: "#6b7280" }}>Selected: {value || "none"}</p>
      </div>
    )
  },
}
