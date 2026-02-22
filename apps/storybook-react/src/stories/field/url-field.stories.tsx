import { URLField } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"

const meta: Meta<typeof URLField> = {
  title: "Fields/Purpose/URLField",
  component: URLField,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof URLField>

/**
 * Basic URL field with proper semantic attributes.
 * Browser provides URL validation and optimized keyboard.
 */
export const URLExample: Story = {
  args: {
    label: "Website",
    input: {
      placeholder: "https://example.com",
    },
  },
  render: (args) => {
    const [url, setUrl] = useState("")

    return (
      <div style={{ width: "320px" }}>
        <URLField
          input={{
            value: url,
            onValueChange: setUrl,
          }}
          {...args}
        />
        <p style={{ marginTop: "16px", fontSize: "14px", color: "#666" }}>
          Current URL: {url || "(empty)"}
        </p>
      </div>
    )
  },
}

/**
 * URL field with helper text.
 */
export const WithHelperText: Story = {
  args: {
    label: "Website",
    helperText: "Include https:// or http:// protocol",
    input: {
      placeholder: "https://example.com",
    },
  },
  render: (args) => {
    const [url, setUrl] = useState("")

    return (
      <div style={{ width: "320px" }}>
        <URLField
          input={{
            value: url,
            onValueChange: setUrl,
          }}
          {...args}
        />
      </div>
    )
  },
}

/**
 * URL field with validation error.
 */
export const WithError: Story = {
  args: {
    label: "Website",
    error: "Please enter a valid URL (must include protocol)",
  },
  render: (args) => {
    const [url, setUrl] = useState("example")

    return (
      <div style={{ width: "320px" }}>
        <URLField
          input={{
            value: url,
            onValueChange: setUrl,
          }}
          {...args}
        />
      </div>
    )
  },
}

/**
 * Required URL field.
 */
export const Required: Story = {
  args: {
    label: "Portfolio website *",
    helperText: "Required field",
    input: {
      required: true,
    },
  },
  render: (args) => {
    const [url, setUrl] = useState("")

    return (
      <div style={{ width: "320px" }}>
        <URLField
          input={{
            value: url,
            onValueChange: setUrl,
          }}
          {...args}
        />
      </div>
    )
  },
}

/**
 * Disabled URL field.
 */
export const Disabled: Story = {
  args: {
    label: "Website",
    input: {
      disabled: true,
    },
  },
  render: (args) => {
    const [url, setUrl] = useState("https://example.com")

    return (
      <div style={{ width: "320px" }}>
        <URLField
          input={{
            value: url,
            onValueChange: setUrl,
          }}
          {...args}
        />
      </div>
    )
  },
}
