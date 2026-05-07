import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { TextareaField } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"

const meta = {
  title: "Input/Molecule/TextareaField",
  component: TextareaField,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof TextareaField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: "Message",
    textarea: { placeholder: "Enter your message..." },
  },
}

export const WithHelperText: Story = {
  args: {
    label: "Bio",
    helperText: "Brief description about yourself.",
    textarea: { placeholder: "Tell us about yourself...", rows: 4 },
  },
}

export const WithError: Story = {
  args: {
    label: "Feedback",
    error: "Feedback is required.",
    textarea: { placeholder: "Your feedback..." },
  },
}

export const Disabled: Story = {
  args: {
    label: "Notes",
    textarea: { placeholder: "Disabled", disabled: true },
  },
}
