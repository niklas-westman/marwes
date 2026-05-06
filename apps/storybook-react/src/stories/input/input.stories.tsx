import { storybookA11yPolicy } from "@marwes-ui/core"
import { Input, Paragraph } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"

const meta: Meta<typeof Input> = {
  title: "Input/Atom/Input",
  component: Input,
  parameters: {
    ...storybookA11yPolicy.smoke,
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    ariaLabel: "Text input",
    placeholder: "Enter text...",
  },
}

export default meta

type Story = StoryObj<typeof Input>

export const Basic: Story = {}

export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState("")

    return (
      <div style={{ width: "320px" }}>
        <Input {...args} value={value} onValueChange={setValue} />
        <Paragraph style={{ marginTop: "16px", fontSize: "14px", color: "#666" }}>
          Current value: {value || "(empty)"}
        </Paragraph>
      </div>
    )
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    value: "Disabled value",
  },
}

export const Invalid: Story = {
  args: {
    invalid: true,
    value: "Invalid input",
    describedBy: "input-error",
  },
  render: (args) => (
    <div style={{ width: "320px" }}>
      <Input {...args} />
      <Paragraph id="input-error" size="sm" style={{ marginTop: "8px" }}>
        Invalid state for validation errors.
      </Paragraph>
    </div>
  ),
}
