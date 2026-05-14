import { storybookA11yPolicy, storybookCheckboxArgTypes, storybookLayout } from "@marwes-ui/core"
import { CheckboxField } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"

const meta = {
  title: "Checkbox/Molecule/CheckboxField",
  component: CheckboxField,
  parameters: { ...storybookLayout.centered, ...storybookA11yPolicy.smoke },
  tags: ["autodocs"],
  args: { label: "Checkbox Field Label" },
  argTypes: { checkbox: storybookCheckboxArgTypes },
} satisfies Meta<typeof CheckboxField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { args: { label: "Subscribe to updates" } }
export const FieldRecommended: Story = {
  args: { label: "Subscribe to updates", checkbox: { size: "md" } },
}
export const FieldWithDescription: Story = {
  args: {
    label: "Subscribe to updates",
    description: "We'll only email you about important product changes.",
    checkbox: { size: "md" },
  },
}
export const FieldWithError: Story = {
  args: {
    label: "Accept terms and conditions",
    error: "You must accept the terms to continue.",
    checkbox: { required: true },
  },
}
export const FieldDisabled: Story = {
  args: {
    label: "Disabled option",
    description: "This option is currently unavailable.",
    checkbox: { disabled: true },
  },
}
export const FieldSizes: Story = { args: { label: "Small checkbox", checkbox: { size: "sm" } } }
export const FieldIndeterminate: Story = {
  args: {
    label: "Select all items",
    description: "Some items are already selected.",
    checkbox: { indeterminate: true },
  },
}
export const FieldControlled: Story = {
  args: {
    label: "Enable notifications",
    description: "Get notified about new features and updates.",
    checkbox: { checked: true },
  },
}
export const FieldWithValidation: Story = {
  args: {
    label: "I accept the terms and conditions",
    error: "You must accept the terms to proceed.",
    checkbox: { required: true },
  },
}
export const WithDescription: Story = {
  args: { label: "Subscribe", description: "Get updates via email." },
}
export const WithError: Story = { args: { label: "Accept terms", error: "Required." } }
export const Disabled: Story = { args: { label: "Disabled", checkbox: { disabled: true } } }
