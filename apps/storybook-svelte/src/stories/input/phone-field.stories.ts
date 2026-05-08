import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { PhoneField } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"

const meta = {
  title: "Input/Purpose/PhoneField",
  component: PhoneField,
  parameters: { ...storybookLayout.centered, ...storybookA11yPolicy.smoke },
  tags: ["autodocs"],
} satisfies Meta<typeof PhoneField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { label: "Phone number", input: { placeholder: "+1 (555) 000-0000" } },
}
export const PhoneExample: Story = {
  args: { label: "Phone number", input: { placeholder: "+1 (555) 000-0000" } },
}
export const WithHelperText: Story = {
  args: {
    label: "Phone number",
    helperText: "Include country code for international numbers",
    input: { placeholder: "+1 (555) 000-0000" },
  },
}
export const WithError: Story = {
  args: { label: "Phone number", error: "Please enter a valid phone number" },
}
export const Required: Story = {
  args: {
    label: "Phone number *",
    helperText: "Required field",
    input: { required: true, placeholder: "+1 (555) 000-0000" },
  },
}
export const Disabled: Story = {
  args: { label: "Phone number", input: { disabled: true, placeholder: "+1 (555) 000-0000" } },
}
