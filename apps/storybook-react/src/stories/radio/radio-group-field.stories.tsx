import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { RadioGroupField } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"

const colorOptions = [
  { value: "red", label: "Red" },
  { value: "blue", label: "Blue" },
  { value: "green", label: "Green" },
]

const meta: Meta<typeof RadioGroupField> = {
  title: "Radio/Molecule",
  component: RadioGroupField,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
}

export default meta

type Story = StoryObj<typeof RadioGroupField>

export const Playground: Story = {
  args: {
    name: "color",
    label: "Favorite color",
    options: colorOptions,
    defaultValue: "red",
  },
}

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = React.useState("blue")
    return (
      <div style={{ display: "grid", gap: 12 }}>
        <RadioGroupField
          name="color"
          label="Favorite color"
          options={colorOptions}
          value={value}
          onChange={setValue}
        />
        <p style={{ fontSize: 14, color: "#6b7280" }}>Selected: {value}</p>
      </div>
    )
  },
}

export const WithDescription: Story = {
  args: {
    name: "plan",
    label: "Select a plan",
    description: "Choose the plan that best fits your needs.",
    options: [
      { value: "free", label: "Free" },
      { value: "pro", label: "Pro" },
      { value: "enterprise", label: "Enterprise" },
    ],
  },
}

export const WithError: Story = {
  args: {
    name: "plan",
    label: "Select a plan",
    error: "Please select a plan to continue.",
    options: [
      { value: "free", label: "Free" },
      { value: "pro", label: "Pro" },
    ],
  },
}

export const Disabled: Story = {
  args: {
    name: "plan",
    label: "Select a plan",
    options: [
      { value: "free", label: "Free" },
      { value: "pro", label: "Pro" },
    ],
    defaultValue: "free",
    disabled: true,
  },
}

export const Required: Story = {
  args: {
    name: "terms",
    label: "Agree to terms",
    options: [
      { value: "agree", label: "I agree" },
      { value: "disagree", label: "I disagree" },
    ],
    required: true,
  },
}
