import { InputOtp, Paragraph } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"

const meta: Meta<typeof InputOtp> = {
  title: "Input/Molecule/InputOtp",
  component: InputOtp,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    label: "Verification code",
    helperText: "Enter the 6-digit code sent to your email",
    length: 6,
  },
}

export default meta

type Story = StoryObj<typeof InputOtp>

export const Basic: Story = {
  render: (args) => (
    <div style={{ width: "320px" }}>
      <InputOtp {...args} />
    </div>
  ),
}

export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState("")

    return (
      <div style={{ width: "320px" }}>
        <InputOtp {...args} value={value} onValueChange={setValue} />
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
    value: "123456",
    helperText: "This code has already been submitted",
  },
  render: (args) => (
    <div style={{ width: "320px" }}>
      <InputOtp {...args} />
    </div>
  ),
}

export const Invalid: Story = {
  args: {
    value: "1234",
    error: "Code expired",
  },
  render: (args) => (
    <div style={{ width: "320px" }}>
      <InputOtp {...args} />
    </div>
  ),
}
