import { CurrencyField, Paragraph } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"

const meta: Meta<typeof CurrencyField> = {
  title: "Fields/Purpose/CurrencyField",
  component: CurrencyField,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof CurrencyField>

/**
 * Basic currency field with USD.
 * Shows decimal keyboard on mobile and displays currency in helper text.
 */
export const CurrencyExample: Story = {
  args: {
    label: "Amount",
    currency: "USD",
    input: {
      placeholder: "0.00",
    },
  },
  render: (args) => {
    const [amount, setAmount] = useState("")

    return (
      <div style={{ width: "320px" }}>
        <CurrencyField
          {...args}
          input={{
            ...args.input,
            value: amount,
            onValueChange: setAmount,
          }}
        />
        <Paragraph style={{ marginTop: "16px", fontSize: "14px", color: "#666" }}>
          Current amount: {amount || "(empty)"}
        </Paragraph>
      </div>
    )
  },
}

/**
 * Currency field with EUR.
 */
export const EuroCurrency: Story = {
  args: {
    label: "Price",
    currency: "EUR",
    input: {
      placeholder: "0.00",
    },
  },
  render: (args) => {
    const [amount, setAmount] = useState("")

    return (
      <div style={{ width: "320px" }}>
        <CurrencyField
          {...args}
          input={{
            ...args.input,
            value: amount,
            onValueChange: setAmount,
          }}
        />
      </div>
    )
  },
}

/**
 * Currency field with GBP.
 */
export const PoundCurrency: Story = {
  args: {
    label: "Cost",
    currency: "GBP",
    input: {
      placeholder: "0.00",
    },
  },
  render: (args) => {
    const [amount, setAmount] = useState("")

    return (
      <div style={{ width: "320px" }}>
        <CurrencyField
          {...args}
          input={{
            ...args.input,
            value: amount,
            onValueChange: setAmount,
          }}
          {...args}
        />
      </div>
    )
  },
}

/**
 * Currency field with custom helper text.
 */
export const WithCustomHelperText: Story = {
  args: {
    label: "Donation amount",
    currency: "USD",
    helperText: "Enter the amount you'd like to donate",
    input: {
      placeholder: "0.00",
    },
  },
  render: (args) => {
    const [amount, setAmount] = useState("")

    return (
      <div style={{ width: "320px" }}>
        <CurrencyField
          {...args}
          input={{
            ...args.input,
            value: amount,
            onValueChange: setAmount,
          }}
        />
      </div>
    )
  },
}

/**
 * Currency field with validation error.
 */
export const WithError: Story = {
  args: {
    label: "Amount",
    currency: "USD",
    error: "Please enter a valid number",
  },
  render: (args) => {
    const [amount, setAmount] = useState("abc")

    return (
      <div style={{ width: "320px" }}>
        <CurrencyField
          {...args}
          input={{
            ...args.input,
            value: amount,
            onValueChange: setAmount,
          }}
        />
      </div>
    )
  },
}

/**
 * Currency field without currency code.
 */
export const NoCurrency: Story = {
  args: {
    label: "Amount",
    helperText: "Enter a numeric value",
    input: {
      placeholder: "0.00",
    },
  },
  render: (args) => {
    const [amount, setAmount] = useState("")

    return (
      <div style={{ width: "320px" }}>
        <CurrencyField
          {...args}
          input={{
            ...args.input,
            value: amount,
            onValueChange: setAmount,
          }}
        />
      </div>
    )
  },
}

/**
 * Required currency field.
 */
export const Required: Story = {
  args: {
    label: "Amount *",
    currency: "USD",
    input: {
      required: true,
    },
  },
  render: (args) => {
    const [amount, setAmount] = useState("")

    return (
      <div style={{ width: "320px" }}>
        <CurrencyField
          {...args}
          input={{
            ...args.input,
            value: amount,
            onValueChange: setAmount,
          }}
        />
      </div>
    )
  },
}

/**
 * Disabled currency field.
 */
export const Disabled: Story = {
  args: {
    label: "Total amount",
    currency: "USD",
    input: {
      disabled: true,
    },
  },
  render: (args) => {
    const [amount, setAmount] = useState("99.99")

    return (
      <div style={{ width: "320px" }}>
        <CurrencyField
          {...args}
          input={{
            ...args.input,
            value: amount,
            onValueChange: setAmount,
          }}
        />
      </div>
    )
  },
}
