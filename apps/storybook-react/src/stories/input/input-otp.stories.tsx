import { storybookA11yPolicy } from "@marwes-ui/core"
import { Paragraph } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
// Atom is no longer the public field — `InputOtpField` is. We deep-import the
// bare atom here for documentation of the cells-only render.
import { InputOtp } from "../../../../../packages/react/src/components/input/input-otp"

const meta: Meta<typeof InputOtp> = {
  title: "Input/Molecule/InputOtp",
  component: InputOtp,
  parameters: {
    ...storybookA11yPolicy.smoke,
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    length: 6,
    ariaLabel: "Verification code",
  },
}

export default meta

type Story = StoryObj<typeof InputOtp>

export const Basic: Story = {
  render: (args) => (
    <div style={{ width: "320px" }}>
      <InputOtp {...args} />
      <Paragraph style={{ marginTop: "16px", fontSize: "12px", color: "#666" }}>
        Bare atom — no label / helper / error. Use `InputOtpField` for labeled forms.
      </Paragraph>
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
  },
}

export const Invalid: Story = {
  args: {
    value: "1234",
    invalid: true,
  },
}
