import { storybookA11yPolicy } from "@marwes-ui/core"
import type { Meta, StoryObj } from "@storybook/svelte"
// Atom is no longer the public field — `InputOtpField` is. We deep-import the
// bare atom here for documentation of the cells-only render.
import InputOtp from "../../../../../packages/svelte/src/lib/components/input/InputOtp.svelte"

const meta = {
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
} satisfies Meta<typeof InputOtp>

export default meta
type Story = StoryObj<typeof meta>

export const Basic: Story = {}

export const Controlled: Story = {
  args: { value: "123456" },
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const Invalid: Story = {
  args: { invalid: true, value: "1234" },
}

export const CustomLength: Story = {
  args: { length: 4, ariaLabel: "PIN" },
}
