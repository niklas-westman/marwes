import { storybookA11yPolicy } from "@marwes-ui/core"
import { InputOtpField } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"

const meta = {
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
} satisfies Meta<typeof InputOtpField>

export default meta
type Story = StoryObj<typeof meta>

export const Basic: Story = {}

export const Controlled: Story = {
  args: { inputOtp: { length: 6, value: "123456" } },
}

export const Disabled: Story = {
  args: { inputOtp: { length: 6, disabled: true } },
}

export const Invalid: Story = {
  args: { error: "Code expired", inputOtp: { length: 6, value: "1234" } },
}

export const CustomLength: Story = {
  args: { label: "PIN", helperText: "Enter your 4-digit PIN", inputOtp: { length: 4 } },
}
