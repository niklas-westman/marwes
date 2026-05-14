import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { ZipCodeField } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"

const meta = {
  title: "Input/Purpose/ZipCodeField",
  component: ZipCodeField,
  parameters: { ...storybookLayout.centered, ...storybookA11yPolicy.smoke },
  tags: ["autodocs"],
} satisfies Meta<typeof ZipCodeField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { args: { label: "ZIP code", input: { placeholder: "02108" } } }
export const Basic: Story = {
  args: {
    label: "ZIP code",
    helperText: "Used for shipping estimates and tax lookup.",
    input: { placeholder: "02108" },
  },
}
export const WithError: Story = {
  args: {
    label: "ZIP code",
    helperText: "Enter a 5-digit ZIP code for US shipping.",
    error: "Invalid ZIP code format",
  },
}
export const Required: Story = {
  args: {
    label: "ZIP code *",
    helperText: "Required for delivery availability.",
    input: { required: true, placeholder: "02108" },
  },
}
export const Disabled: Story = {
  args: {
    label: "ZIP code",
    helperText: "Locked to the verified billing address.",
    input: { disabled: true, placeholder: "02108" },
  },
}
