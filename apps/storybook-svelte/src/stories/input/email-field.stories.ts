import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { EmailField } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"

const meta = {
  title: "Input/Purpose/EmailField",
  component: EmailField,
  parameters: { ...storybookLayout.centered, ...storybookA11yPolicy.smoke },
  tags: ["autodocs"],
} satisfies Meta<typeof EmailField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { label: "Email address", input: { placeholder: "jane@example.com" } },
}
export const EmailExample: Story = {
  args: { label: "Email address", input: { placeholder: "you@example.com" } },
}
export const WithHelperText: Story = {
  args: {
    label: "Email address",
    helperText: "We'll never share your email with anyone else",
    input: { placeholder: "you@example.com" },
  },
}
export const WithError: Story = {
  args: {
    label: "Email address",
    error: "Please enter a valid email.",
    input: { placeholder: "jane@example.com" },
  },
}
export const Required: Story = {
  args: {
    label: "Email address *",
    helperText: "Required field",
    input: { required: true, placeholder: "you@example.com" },
  },
}
export const Disabled: Story = {
  args: { label: "Email address", input: { disabled: true, placeholder: "you@example.com" } },
}
