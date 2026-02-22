import { EmailField, Paragraph } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"

const meta: Meta<typeof EmailField> = {
  title: "Fields/Purpose/EmailField",
  component: EmailField,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof EmailField>

/**
 * Basic email field with proper semantic attributes.
 * Browser provides email validation and optimized keyboard on mobile.
 */
export const EmailExample: Story = {
  args: {
    label: "Email address",
    input: {
      placeholder: "you@example.com",
    },
  },
  render: (args) => {
    const [email, setEmail] = useState("")

    return (
      <div style={{ width: "320px" }}>
        <EmailField
          input={{
            value: email,
            onValueChange: setEmail,
          }}
          {...args}
        />
        <Paragraph style={{ marginTop: "16px", fontSize: "14px", color: "#666" }}>
          Current email: {email || "(empty)"}
        </Paragraph>
      </div>
    )
  },
}

/**
 * Email field with helper text.
 */
export const WithHelperText: Story = {
  args: {
    label: "Email address",
    helperText: "We'll never share your email with anyone else",
    input: {
      placeholder: "you@example.com",
    },
  },
  render: (args) => {
    const [email, setEmail] = useState("")

    return (
      <div style={{ width: "320px" }}>
        <EmailField
          input={{
            value: email,
            onValueChange: setEmail,
          }}
          {...args}
        />
      </div>
    )
  },
}

/**
 * Email field with validation error.
 */
export const WithError: Story = {
  args: {
    label: "Email address",
  },
  render: (args) => {
    const [email, setEmail] = useState("invalid-email")

    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    const showError = email.length > 0 && !isValid

    return (
      <div style={{ width: "320px" }}>
        <EmailField
          error={showError ? "Please enter a valid email address" : ""}
          input={{
            value: email,
            onValueChange: setEmail,
          }}
          {...args}
        />
      </div>
    )
  },
}

/**
 * Required email field.
 */
export const Required: Story = {
  args: {
    label: "Email address *",
    helperText: "Required field",
    input: {
      required: true,
    },
  },
  render: (args) => {
    const [email, setEmail] = useState("")

    return (
      <div style={{ width: "320px" }}>
        <EmailField
          input={{
            value: email,
            onValueChange: setEmail,
          }}
          {...args}
        />
      </div>
    )
  },
}

/**
 * Disabled email field.
 */
export const Disabled: Story = {
  args: {
    label: "Email address",
    input: {
      disabled: true,
    },
  },
  render: (args) => {
    const [email, setEmail] = useState("user@example.com")

    return (
      <div style={{ width: "320px" }}>
        <EmailField
          input={{
            value: email,
            onValueChange: setEmail,
          }}
          {...args}
        />
      </div>
    )
  },
}
