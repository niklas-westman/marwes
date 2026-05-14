import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { PasswordField } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"

const meta = {
  title: "Input/Purpose/PasswordField",
  component: PasswordField,
  parameters: { ...storybookLayout.centered, ...storybookA11yPolicy.smoke },
  tags: ["autodocs"],
} satisfies Meta<typeof PasswordField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { label: "Password", input: { placeholder: "Enter your password" } },
}
export const PasswordExample: Story = {
  args: { label: "Password", input: { placeholder: "Enter your password" } },
}
export const WithHelperText: Story = {
  args: {
    label: "Password",
    helperText: "Must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number",
    input: { placeholder: "Enter your password" },
  },
}
export const WithError: Story = {
  args: {
    label: "Password",
    error: "Password must be at least 8 characters.",
    input: { placeholder: "Enter your password" },
  },
}
export const NewPassword: Story = {
  args: {
    label: "New Password",
    helperText: "Choose a strong password for your account",
    input: { autoComplete: "new-password", placeholder: "Enter your new password" },
  },
}
export const PasswordConfirmation: Story = {
  args: {
    label: "Confirm Password",
    input: { autoComplete: "new-password", placeholder: "Confirm your password" },
  },
}
export const Disabled: Story = {
  args: { label: "Password", input: { disabled: true, placeholder: "Enter your password" } },
}
