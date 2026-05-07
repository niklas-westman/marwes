import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { CheckboxField } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"

const meta = {
  title: "Checkbox/Molecule/CheckboxField",
  component: CheckboxField,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof CheckboxField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { label: "Subscribe to updates" },
}

export const WithDescription: Story = {
  args: {
    label: "Subscribe to updates",
    description: "We'll only email you about important product changes.",
  },
}

export const WithError: Story = {
  args: {
    label: "Accept terms and conditions",
    error: "You must accept the terms to continue.",
  },
}

export const Disabled: Story = {
  args: {
    label: "Disabled option",
    description: "This option is currently unavailable.",
    checkbox: { disabled: true },
  },
}
