import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { PasswordField } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"

const meta = {
  title: "Input/Purpose/PasswordField",
  component: PasswordField,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof PasswordField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: "Password",
    input: { placeholder: "Enter password" },
  },
}

export const WithError: Story = {
  args: {
    label: "Password",
    error: "Password must be at least 8 characters.",
    input: { placeholder: "Enter password" },
  },
}
