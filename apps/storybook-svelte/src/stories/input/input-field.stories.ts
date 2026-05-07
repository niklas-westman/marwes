import { storybookLayout } from "@marwes-ui/core"
import { InputField } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"

const meta = {
  title: "Inputs/Molecule/InputField",
  component: InputField,
  parameters: {
    ...storybookLayout.centered,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof InputField>

export default meta
type Story = StoryObj<typeof meta>

export const Basic: Story = {
  args: {
    label: "Full name",
    input: { placeholder: "Jane Doe" },
  },
}

export const WithHelperText: Story = {
  args: {
    label: "Username",
    helperText: "Choose a unique username between 3-20 characters.",
    input: { placeholder: "johnsmith" },
  },
}

export const WithError: Story = {
  args: {
    label: "Password",
    error: "Password must be at least 8 characters.",
    input: { type: "password" },
  },
}

export const WithLeadingSymbol: Story = {
  args: {
    label: "Amount",
    leadingSymbol: "$",
    input: { placeholder: "0.00", inputMode: "decimal" },
  },
}

export const Disabled: Story = {
  args: {
    label: "Account ID",
    input: { value: "ACC-12345", disabled: true },
  },
}
