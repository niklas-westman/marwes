import { Paragraph, Textarea } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"

const meta: Meta<typeof Textarea> = {
  title: "Input/Atom/Textarea",
  component: Textarea,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    placeholder: "Add more detail...",
    rows: 4,
  },
}

export default meta

type Story = StoryObj<typeof Textarea>

export const Basic: Story = {}

export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState("")

    return (
      <div style={{ width: "320px" }}>
        <Textarea {...args} value={value} onValueChange={setValue} />
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
    value: "This description is locked.",
  },
}

export const Invalid: Story = {
  args: {
    invalid: true,
    value: "Needs more detail",
    describedBy: "textarea-error",
  },
  render: (args) => (
    <div style={{ width: "320px" }}>
      <Textarea {...args} />
      <Paragraph id="textarea-error" size="sm" style={{ marginTop: "8px" }}>
        Invalid state for validation errors.
      </Paragraph>
    </div>
  ),
}
