import { storybookA11yPolicy } from "@marwes-ui/core"
import { DateOfBirthField, Paragraph } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"

const meta: Meta<typeof DateOfBirthField> = {
  title: "Input/Purpose/DateOfBirthField",
  component: DateOfBirthField,
  parameters: {
    ...storybookA11yPolicy.smoke,
    layout: "centered",
  },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof DateOfBirthField>

export const Basic: Story = {
  args: {
    label: "Date of birth",
    helperText: "Used for age checks and account verification.",
  },
  render: (args) => {
    const [birthDate, setBirthDate] = useState("")

    return (
      <div style={{ width: "320px" }}>
        <DateOfBirthField
          input={{
            value: birthDate,
            onValueChange: setBirthDate,
          }}
          {...args}
        />
        <Paragraph style={{ marginTop: "16px", fontSize: "14px", color: "#666" }}>
          Current value: {birthDate || "(empty)"}
        </Paragraph>
      </div>
    )
  },
}

export const WithError: Story = {
  args: {
    label: "Date of birth",
    helperText: "Future dates are rejected.",
  },
  render: (args) => {
    const [birthDate, setBirthDate] = useState("2035-01-01")
    const showError = birthDate.length > 0 && birthDate > "2026-03-30"

    return (
      <div style={{ width: "320px" }}>
        <DateOfBirthField
          error={showError ? "Date of birth cannot be in the future" : ""}
          input={{
            value: birthDate,
            onValueChange: setBirthDate,
          }}
          {...args}
        />
      </div>
    )
  },
}

export const Required: Story = {
  args: {
    label: "Date of birth *",
    helperText: "Required for profile completion.",
    input: {
      required: true,
    },
  },
  render: (args) => {
    const [birthDate, setBirthDate] = useState("")

    return (
      <div style={{ width: "320px" }}>
        <DateOfBirthField
          input={{
            value: birthDate,
            onValueChange: setBirthDate,
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
    label: "Date of birth",
    helperText: "This value is locked after verification.",
    input: {
      disabled: true,
    },
  },
  render: (args) => {
    const [birthDate, setBirthDate] = useState("1995-04-18")

    return (
      <div style={{ width: "320px" }}>
        <DateOfBirthField
          input={{
            value: birthDate,
            onValueChange: setBirthDate,
            ...args.input,
          }}
          {...args}
        />
      </div>
    )
  },
}
