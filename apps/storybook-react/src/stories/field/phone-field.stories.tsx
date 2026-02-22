import { PhoneField } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"

const meta: Meta<typeof PhoneField> = {
  title: "Fields/Purpose/PhoneField",
  component: PhoneField,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof PhoneField>

/**
 * Basic phone field with proper semantic attributes.
 * Mobile devices show phone-optimized keyboard.
 */
export const PhoneExample: Story = {
  args: {
    label: "Phone number",
    input: {
      placeholder: "+1 (555) 000-0000",
    },
  },
  render: (args) => {
    const [phone, setPhone] = useState("")

    return (
      <div style={{ width: "320px" }}>
        <PhoneField
          input={{
            value: phone,
            onValueChange: setPhone,
          }}
          {...args}
        />
        <p style={{ marginTop: "16px", fontSize: "14px", color: "#666" }}>
          Current phone: {phone || "(empty)"}
        </p>
      </div>
    )
  },
}

/**
 * Phone field with helper text.
 */
export const WithHelperText: Story = {
  args: {
    label: "Phone number",
    helperText: "Include country code for international numbers",
    input: {
      placeholder: "+1 (555) 000-0000",
    },
  },
  render: (args) => {
    const [phone, setPhone] = useState("")

    return (
      <div style={{ width: "320px" }}>
        <PhoneField
          input={{
            value: phone,
            onValueChange: setPhone,
          }}
          {...args}
        />
      </div>
    )
  },
}

/**
 * Phone field with validation error.
 */
export const WithError: Story = {
  args: {
    label: "Phone number",
    error: "Please enter a valid phone number",
  },
  render: (args) => {
    const [phone, setPhone] = useState("555")

    return (
      <div style={{ width: "320px" }}>
        <PhoneField
          input={{
            value: phone,
            onValueChange: setPhone,
          }}
          {...args}
        />
      </div>
    )
  },
}

/**
 * Required phone field.
 */
export const Required: Story = {
  args: {
    label: "Phone number *",
    helperText: "Required field",
    input: {
      required: true,
    },
  },
  render: (args) => {
    const [phone, setPhone] = useState("")

    return (
      <div style={{ width: "320px" }}>
        <PhoneField
          input={{
            value: phone,
            onValueChange: setPhone,
          }}
          {...args}
        />
      </div>
    )
  },
}

/**
 * Disabled phone field.
 */
export const Disabled: Story = {
  args: {
    label: "Phone number",
    input: {
      disabled: true,
    },
  },
  render: (args) => {
    const [phone, setPhone] = useState("+1 (555) 123-4567")

    return (
      <div style={{ width: "320px" }}>
        <PhoneField
          input={{
            value: phone,
            onValueChange: setPhone,
          }}
          {...args}
        />
      </div>
    )
  },
}
