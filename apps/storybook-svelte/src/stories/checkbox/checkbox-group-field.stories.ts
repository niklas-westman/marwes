import { storybookA11yPolicy, storybookCheckboxArgTypes, storybookLayout } from "@marwes-ui/core"
import { CheckboxGroupField } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"

const notificationOptions = [
  { value: "email", label: "Email updates" },
  { value: "sms", label: "SMS alerts" },
  { value: "push", label: "Push notifications" },
]

const meta = {
  title: "Checkbox/Molecule/CheckboxGroupField",
  component: CheckboxGroupField,
  parameters: { ...storybookLayout.centered, ...storybookA11yPolicy.smoke },
  tags: ["autodocs"],
  args: {
    label: "Notification preferences",
    options: notificationOptions,
    checkbox: { size: "md" },
  },
  argTypes: { checkbox: storybookCheckboxArgTypes },
} satisfies Meta<typeof CheckboxGroupField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const GroupRecommended: Story = {}
export const GroupWithDescription: Story = {
  args: { description: "Choose every channel you want us to use when contacting you." },
}
export const GroupWithError: Story = {
  args: { error: "Select at least one notification channel." },
}
export const GroupDisabled: Story = {
  args: {
    description: "Notification preferences are managed by your workspace admin.",
    defaultValue: ["email"],
    disabled: true,
  },
}
export const GroupControlled: Story = {
  args: { value: ["email"], description: "Control which alerts we send." },
}
export const GroupWithIndeterminateParent: Story = {
  args: { description: "Use the parent checkbox to toggle every mailbox." },
}
export const WithError: Story = { args: { error: "Select at least one." } }
export const Disabled: Story = { args: { disabled: true } }
