import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { DateOfBirthField } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"

const meta = {
  title: "Input/Purpose/DateOfBirthField",
  component: DateOfBirthField,
  parameters: { ...storybookLayout.centered, ...storybookA11yPolicy.smoke },
  tags: ["autodocs"],
} satisfies Meta<typeof DateOfBirthField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { args: { label: "Date of birth" } }
export const Basic: Story = {
  args: { label: "Date of birth", helperText: "Used for age checks and account verification." },
}
export const WithError: Story = {
  args: {
    label: "Date of birth",
    helperText: "Future dates are rejected.",
    error: "Date cannot be in the future",
  },
}
export const Required: Story = {
  args: {
    label: "Date of birth *",
    helperText: "Required for profile completion.",
    input: { required: true },
  },
}
export const Disabled: Story = {
  args: {
    label: "Date of birth",
    helperText: "This value is locked after verification.",
    input: { disabled: true },
  },
}
