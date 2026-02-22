import { InputField, Paragraph } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"

const meta: Meta<typeof InputField> = {
  title: "Fields/General/InputField",
  component: InputField,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    label: "Label",
  },
}

export default meta

type Story = StoryObj<typeof InputField>

/**
 * Basic input field with label and placeholder
 */
export const Basic: Story = {
  args: {
    label: "Label",
    input: {
      placeholder: "Enter text...",
    },
  },
}

/**
 * Input field with helper text to provide additional context
 */
export const WithHelperText: Story = {
  args: {
    label: "Label",
    helperText: "Additional information to help the user.",
    input: {
      placeholder: "Enter text...",
    },
  },
  render: (args) => {
    const [value, setValue] = useState("")

    return (
      <div style={{ width: "320px" }}>
        <InputField
          {...args}
          input={{
            ...args.input,
            value,
            onValueChange: setValue,
          }}
        />
      </div>
    )
  },
}

/**
 * Input field displaying an error state
 */
export const WithError: Story = {
  args: {
    label: "Label",
    error: "This field is required.",
    input: {
      placeholder: "Enter text...",
    },
  },
  render: (args) => {
    const [value, setValue] = useState("")

    return (
      <div style={{ width: "320px" }}>
        <InputField
          {...args}
          input={{
            ...args.input,
            value,
            onValueChange: setValue,
          }}
        />
      </div>
    )
  },
}

/**
 * Disabled input field that cannot be interacted with
 */
export const Disabled: Story = {
  args: {
    label: "Label",
    input: {
      disabled: true,
    },
  },
  render: (args) => {
    const [value, setValue] = useState("Disabled value")

    return (
      <div style={{ width: "320px" }}>
        <InputField
          {...args}
          input={{
            ...args.input,
            value,
            onValueChange: setValue,
          }}
        />
      </div>
    )
  },
}

/**
 * Read-only input field that displays a value but cannot be edited
 */
export const ReadOnly: Story = {
  args: {
    label: "Label",
    input: {
      readOnly: true,
    },
  },
  render: (args) => {
    const [value, setValue] = useState("Read-only value")

    return (
      <div style={{ width: "320px" }}>
        <InputField
          {...args}
          input={{
            ...args.input,
            value,
            onValueChange: setValue,
          }}
        />
      </div>
    )
  },
}

/**
 * Required field with indicator
 */
export const Required: Story = {
  args: {
    label: "Label *",
    helperText: "This field is required",
    input: {
      required: true,
      placeholder: "Enter text...",
    },
  },
  render: (args) => {
    const [value, setValue] = useState("")

    return (
      <div style={{ width: "320px" }}>
        <InputField
          {...args}
          input={{
            ...args.input,
            value,
            onValueChange: setValue,
          }}
        />
      </div>
    )
  },
}

/**
 * Controlled input field with state management
 */
export const Controlled: Story = {
  args: {
    label: "Label",
    helperText: "Type something to see the controlled value",
    input: {
      placeholder: "Enter text...",
    },
  },
  render: (args) => {
    const [value, setValue] = useState("")

    return (
      <div style={{ width: "320px" }}>
        <InputField
          {...args}
          input={{
            ...args.input,
            value: value,
            onValueChange: setValue,
          }}
        />
        <Paragraph style={{ marginTop: "16px", fontSize: "14px", color: "#666" }}>
          Current value: {value || "(empty)"}
        </Paragraph>
      </div>
    )
  },
}
