import { Paragraph, PasswordField } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"

const meta: Meta<typeof PasswordField> = {
  title: "Fields/Purpose/PasswordField",
  component: PasswordField,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof PasswordField>

/**
 * Basic password field with show/hide toggle.
 * Click the eye icon to reveal the password.
 */
export const PasswordExample: Story = {
  args: {
    label: "Password",
    input: {
      placeholder: "Enter your password",
    },
  },
  render: (args) => {
    const [password, setPassword] = useState("")

    return (
      <div style={{ width: "320px" }}>
        <PasswordField
          input={{
            value: password,
            onValueChange: setPassword,
          }}
          {...args}
        />
        <Paragraph style={{ marginTop: "16px", fontSize: "14px", color: "#666" }}>
          Current password: {password || "(empty)"}
        </Paragraph>
      </div>
    )
  },
}

/**
 * Password field with helper text.
 */
export const WithHelperText: Story = {
  args: {
    label: "Password",
    helperText: "Must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number",
    input: {
      placeholder: "Enter your password",
    },
  },
  render: (args) => {
    const [password, setPassword] = useState("")

    return (
      <div style={{ width: "320px" }}>
        <PasswordField
          input={{
            value: password,
            onValueChange: setPassword,
          }}
          {...args}
        />
      </div>
    )
  },
}

/**
 * Password field with validation error.
 */
export const WithError: Story = {
  args: {
    label: "Password",
    error: "Password must be at least 8 characters.",
    input: {
      placeholder: "Enter your password",
    },
  },
  render: (args) => {
    const [password, setPassword] = useState("weak")

    return (
      <div style={{ width: "320px" }}>
        <PasswordField
          input={{
            value: password,
            onValueChange: setPassword,
          }}
          {...args}
        />
      </div>
    )
  },
}

/**
 * New password field (e.g., for signup or password reset).
 * Uses autocomplete="new-password" to prevent autofill.
 */
export const NewPassword: Story = {
  args: {
    label: "New Password",
    autoComplete: "new-password",
    helperText: "Choose a strong password for your account",
    input: {
      placeholder: "Enter your new password",
    },
  },
  render: (args) => {
    const [password, setPassword] = useState("")

    return (
      <div style={{ width: "320px" }}>
        <PasswordField
          input={{
            value: password,
            onValueChange: setPassword,
          }}
          {...args}
        />
      </div>
    )
  },
}

/**
 * Disabled password field.
 */
export const Disabled: Story = {
  args: {
    label: "Password",
    input: {
      value: "••••••••",
      disabled: true,
    },
  },
  render: (args) => (
    <div style={{ width: "320px" }}>
      <PasswordField {...args} />
    </div>
  ),
}

/**
 * Password confirmation field (typical signup flow).
 */
export const PasswordConfirmation: Story = {
  render: () => {
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const passwordsMatch = password === confirmPassword
    const showError = confirmPassword.length > 0 && !passwordsMatch

    return (
      <div style={{ width: "320px", display: "grid", gap: "24px" }}>
        <PasswordField
          label="New Password"
          autoComplete="new-password"
          input={{
            value: password,
            onValueChange: setPassword,
          }}
        />
        <PasswordField
          label="Confirm Password"
          autoComplete="new-password"
          error={showError ? "Passwords do not match" : ""}
          input={{
            value: confirmPassword,
            onValueChange: setConfirmPassword,
          }}
        />
      </div>
    )
  },
}
