import { storybookLayout } from "@marwes-ui/core"
import { OptionRadioGroup } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"

const meta: Meta<typeof OptionRadioGroup> = {
  title: "Radio/Context/Option",
  component: OptionRadioGroup,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
}

export default meta

type Story = StoryObj<typeof OptionRadioGroup>

export const Default: Story = {
  args: {
    name: "theme",
    label: "Select theme",
    options: [
      { value: "light", label: "Light" },
      { value: "dark", label: "Dark" },
      { value: "system", label: "System" },
    ],
    defaultValue: "system",
  },
}

export const WithDescription: Story = {
  args: {
    name: "shipping",
    label: "Shipping method",
    description: "Choose how you'd like your order delivered.",
    options: [
      { value: "standard", label: "Standard (5-7 days)" },
      { value: "express", label: "Express (2-3 days)" },
      { value: "overnight", label: "Overnight" },
    ],
  },
}

export const WithError: Story = {
  args: {
    name: "shipping",
    label: "Shipping method",
    error: "Please select a shipping method.",
    options: [
      { value: "standard", label: "Standard" },
      { value: "express", label: "Express" },
    ],
  },
}

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = React.useState("dark")
    return (
      <div style={{ display: "grid", gap: 12 }}>
        <OptionRadioGroup
          name="theme"
          label="Select theme"
          options={[
            { value: "light", label: "Light" },
            { value: "dark", label: "Dark" },
            { value: "system", label: "System" },
          ]}
          value={value}
          onChange={setValue}
        />
        <p style={{ fontSize: 14, color: "#6b7280" }}>Selected: {value}</p>
      </div>
    )
  },
}
