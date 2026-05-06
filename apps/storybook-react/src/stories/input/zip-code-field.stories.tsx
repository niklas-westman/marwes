import { storybookA11yPolicy } from "@marwes-ui/core"
import { ZipCodeField } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"

const meta: Meta<typeof ZipCodeField> = {
  title: "Input/Purpose/ZipCodeField",
  component: ZipCodeField,
  parameters: {
    ...storybookA11yPolicy.smoke,
    layout: "centered",
  },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof ZipCodeField>

export const Basic: Story = {
  args: {
    label: "ZIP code",
    helperText: "Used for shipping estimates and tax lookup.",
    input: {
      placeholder: "02108",
    },
  },
  render: (args) => {
    const [zipCode, setZipCode] = useState("")

    return (
      <div style={{ width: "320px" }}>
        <ZipCodeField
          input={{
            value: zipCode,
            onValueChange: setZipCode,
            ...args.input,
          }}
          {...args}
        />
        <p style={{ marginTop: "16px", fontSize: "14px", color: "#666" }}>
          Current ZIP code: {zipCode || "(empty)"}
        </p>
      </div>
    )
  },
}

export const WithError: Story = {
  args: {
    label: "ZIP code",
    helperText: "Enter a 5-digit ZIP code for US shipping.",
  },
  render: (args) => {
    const [zipCode, setZipCode] = useState("12")
    const showError = zipCode.length > 0 && zipCode.length < 5

    return (
      <div style={{ width: "320px" }}>
        <ZipCodeField
          error={showError ? "Enter a valid ZIP code" : ""}
          input={{
            value: zipCode,
            onValueChange: setZipCode,
            placeholder: "02108",
          }}
          {...args}
        />
      </div>
    )
  },
}

export const Required: Story = {
  args: {
    label: "ZIP code *",
    helperText: "Required for delivery availability.",
    input: {
      required: true,
      placeholder: "02108",
    },
  },
  render: (args) => {
    const [zipCode, setZipCode] = useState("")

    return (
      <div style={{ width: "320px" }}>
        <ZipCodeField
          input={{
            value: zipCode,
            onValueChange: setZipCode,
            ...args.input,
          }}
          {...args}
        />
      </div>
    )
  },
}

export const Disabled: Story = {
  args: {
    label: "ZIP code",
    helperText: "Locked to the verified billing address.",
    input: {
      disabled: true,
      placeholder: "02108",
    },
  },
  render: (args) => {
    const [zipCode, setZipCode] = useState("02108")

    return (
      <div style={{ width: "320px" }}>
        <ZipCodeField
          input={{
            value: zipCode,
            onValueChange: setZipCode,
            ...args.input,
          }}
          {...args}
        />
      </div>
    )
  },
}
