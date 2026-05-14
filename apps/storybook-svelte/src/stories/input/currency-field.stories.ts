import { currencyCodes, storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { CurrencyField } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"

const meta = {
  title: "Input/Purpose/CurrencyField",
  component: CurrencyField,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
  argTypes: {
    currency: { control: "select", options: currencyCodes },
  },
} satisfies Meta<typeof CurrencyField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { label: "Amount", input: { placeholder: "0.00" } },
}

export const CurrencyExample: Story = {
  args: { label: "Amount", currency: "USD", input: { placeholder: "0.00" } },
}

export const EuroCurrency: Story = {
  args: { label: "Price", currency: "EUR", input: { placeholder: "0.00" } },
}

export const PoundCurrency: Story = {
  args: { label: "Cost", currency: "GBP", input: { placeholder: "0.00" } },
}

export const WithCustomHelperText: Story = {
  args: {
    label: "Donation amount",
    currency: "USD",
    helperText: "Enter the amount you'd like to donate",
    input: { placeholder: "0.00" },
  },
}

export const WithError: Story = {
  args: { label: "Amount", currency: "USD", error: "Please enter a valid number" },
}

export const NoCurrency: Story = {
  args: { label: "Amount", helperText: "Enter a numeric value", input: { placeholder: "0.00" } },
}

export const Required: Story = {
  args: { label: "Amount *", currency: "USD", input: { required: true } },
}

export const Disabled: Story = {
  args: { label: "Total amount", currency: "USD", input: { disabled: true } },
}
