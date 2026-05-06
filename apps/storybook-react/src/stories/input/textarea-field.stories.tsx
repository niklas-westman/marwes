import { storybookA11yPolicy } from "@marwes-ui/core"
import { Paragraph, TextareaField } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"

const meta: Meta<typeof TextareaField> = {
  title: "Input/Molecule/TextareaField",
  component: TextareaField,
  parameters: {
    ...storybookA11yPolicy.smoke,
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    label: "Description",
    textarea: {
      placeholder: "Add more detail...",
      rows: 4,
    },
  },
}

export default meta

type Story = StoryObj<typeof TextareaField>

export const Basic: Story = {}

export const WithHelperText: Story = {
  args: {
    helperText: "Use 2-3 sentences so reviewers have enough context.",
  },
  render: (args) => {
    const [value, setValue] = useState("")

    return (
      <div style={{ width: "320px" }}>
        <TextareaField
          {...args}
          textarea={{
            ...args.textarea,
            value,
            onValueChange: setValue,
          }}
        />
      </div>
    )
  },
}

export const WithError: Story = {
  args: {
    error: "Description is required.",
  },
  render: (args) => {
    const [value, setValue] = useState("")

    return (
      <div style={{ width: "320px" }}>
        <TextareaField
          {...args}
          textarea={{
            ...args.textarea,
            value,
            onValueChange: setValue,
          }}
        />
      </div>
    )
  },
}

export const Disabled: Story = {
  args: {
    textarea: {
      disabled: true,
      rows: 4,
    },
  },
  render: (args) => {
    const [value, setValue] = useState("Locked content")

    return (
      <div style={{ width: "320px" }}>
        <TextareaField
          {...args}
          textarea={{
            ...args.textarea,
            value,
            onValueChange: setValue,
          }}
        />
      </div>
    )
  },
}

export const ReadOnly: Story = {
  args: {
    textarea: {
      readOnly: true,
      rows: 4,
    },
  },
  render: (args) => {
    const [value, setValue] = useState("Read-only summary")

    return (
      <div style={{ width: "320px" }}>
        <TextareaField
          {...args}
          textarea={{
            ...args.textarea,
            value,
            onValueChange: setValue,
          }}
        />
      </div>
    )
  },
}

export const Controlled: Story = {
  args: {
    helperText: "Type something to see the controlled value",
  },
  render: (args) => {
    const [value, setValue] = useState("")

    return (
      <div style={{ width: "320px" }}>
        <TextareaField
          {...args}
          textarea={{
            ...args.textarea,
            value,
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
