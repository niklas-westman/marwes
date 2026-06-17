import { storybookA11yPolicy } from "@marwes-ui/core"
import { InputOtpField, Paragraph } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"

const meta: Meta<typeof InputOtpField> = {
  title: "Input/Molecule/InputOtpField",
  component: InputOtpField,
  parameters: {
    ...storybookA11yPolicy.smoke,
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    label: "Verification code",
    helperText: "Enter the 6-digit code sent to your email",
    inputOtp: { length: 6 },
  },
}

export default meta

type Story = StoryObj<typeof InputOtpField>

export const Basic: Story = {
  render: (args) => (
    <div style={{ width: "320px" }}>
      <InputOtpField {...args} />
    </div>
  ),
}

export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState("")
    return (
      <div style={{ width: "320px" }}>
        <InputOtpField {...args} inputOtp={{ ...args.inputOtp, value, onValueChange: setValue }} />
        <Paragraph style={{ marginTop: "16px", fontSize: "14px", color: "#666" }}>
          Current value: {value || "(empty)"}
        </Paragraph>
      </div>
    )
  },
}

export const Disabled: Story = {
  args: {
    helperText: "This code has already been submitted",
    inputOtp: { length: 6, disabled: true, value: "123456" },
  },
  render: (args) => (
    <div style={{ width: "320px" }}>
      <InputOtpField {...args} />
    </div>
  ),
}

export const Invalid: Story = {
  args: {
    error: "Code expired",
    inputOtp: { length: 6, value: "1234" },
  },
  render: (args) => (
    <div style={{ width: "320px" }}>
      <InputOtpField {...args} />
    </div>
  ),
}
