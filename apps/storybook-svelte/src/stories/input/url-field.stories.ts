import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { URLField } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"

const meta = {
  title: "Input/Purpose/URLField",
  component: URLField,
  parameters: { ...storybookLayout.centered, ...storybookA11yPolicy.smoke },
  tags: ["autodocs"],
} satisfies Meta<typeof URLField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { label: "Website", input: { placeholder: "https://example.com" } },
}
export const URLExample: Story = {
  args: { label: "Website", input: { placeholder: "https://example.com" } },
}
export const WithHelperText: Story = {
  args: {
    label: "Website",
    helperText: "Include https:// or http:// protocol",
    input: { placeholder: "https://example.com" },
  },
}
export const WithError: Story = {
  args: { label: "Website", error: "Please enter a valid URL (must include protocol)" },
}
export const Required: Story = {
  args: { label: "Portfolio website *", helperText: "Required field", input: { required: true } },
}
export const Disabled: Story = {
  args: { label: "Website", input: { disabled: true, placeholder: "https://example.com" } },
}
