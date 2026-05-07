import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { EmailField } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"

const meta = {
  title: "Input/Purpose/EmailField",
  component: EmailField,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof EmailField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: "Email address",
    input: { placeholder: "jane@example.com" },
  },
}

export const WithError: Story = {
  args: {
    label: "Email address",
    error: "Please enter a valid email.",
    input: { placeholder: "jane@example.com" },
  },
}
