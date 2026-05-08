import { storybookA11yPolicy } from "@marwes-ui/core"
import { InputOtp } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"

const meta = {
  title: "Input/Molecule/InputOtp",
  component: InputOtp,
  parameters: {
    ...storybookA11yPolicy.smoke,
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    label: "Verification code",
    helperText: "Enter the 6-digit code sent to your email",
    length: 6,
  },
} satisfies Meta<typeof InputOtp>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Basic: Story = {}

export const Controlled: Story = {
  args: { value: "123456" },
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const Invalid: Story = {
  args: { error: "Invalid code" },
}

export const WithError: Story = {
  args: {
    value: "1234",
    error: "Code expired",
  },
}

export const CustomLength: Story = {
  args: {
    label: "PIN",
    helperText: "Enter your 4-digit PIN",
    length: 4,
  },
}
