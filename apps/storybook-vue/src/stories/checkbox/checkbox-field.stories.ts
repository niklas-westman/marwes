import { CheckboxField } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

const meta: Meta<typeof CheckboxField> = {
  title: "Checkbox/Field",
  component: CheckboxField,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    label: "Checkbox Field Label",
    checkbox: { size: "md" },
  },
}

export default meta
type Story = StoryObj<typeof CheckboxField>

export const FieldRecommended: Story = {
  args: {
    label: "Subscribe to updates",
    checkbox: { size: "md" },
  },
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
