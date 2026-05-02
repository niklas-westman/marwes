import { Paragraph, RichTextField } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"

const meta: Meta<typeof RichTextField> = {
  title: "Input/Molecule/RichTextField",
  component: RichTextField,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Field-wrapped rich text editor. This inherits the same manual-review-heavy boundary as RichText: automated tests protect the wrapper contract, but editor accessibility should still be validated in supported browser and assistive technology combinations.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    label: "Description",
    editor: {
      placeholder: "Write a formatted description...",
    },
  },
}

export default meta

type Story = StoryObj<typeof RichTextField>

export const Basic: Story = {}

export const WithHelperText: Story = {
  args: {
    helperText: "Use bold, italic, and underline to highlight the most important details.",
  },
  render: (args) => {
    const [value, setValue] = useState("")

    return (
      <div style={{ width: "320px" }}>
        <RichTextField
          {...args}
          editor={{
            ...args.editor,
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
    const [value, setValue] = useState("<p><strong>Missing context</strong></p>")

    return (
      <div style={{ width: "320px" }}>
        <RichTextField
          {...args}
          editor={{
            ...args.editor,
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
    editor: {
      disabled: true,
    },
  },
  render: (args) => {
    const [value, setValue] = useState("<p><strong>Locked</strong> content</p>")

    return (
      <div style={{ width: "320px" }}>
        <RichTextField
          {...args}
          editor={{
            ...args.editor,
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
    editor: {
      readOnly: true,
    },
  },
  render: (args) => {
    const [value, setValue] = useState("<p><em>Read-only</em> summary with <u>underline</u></p>")

    return (
      <div style={{ width: "320px" }}>
        <RichTextField
          {...args}
          editor={{
            ...args.editor,
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
    helperText: "Format text and inspect the emitted HTML below.",
  },
  render: (args) => {
    const [value, setValue] = useState("<p>Start typing...</p>")

    return (
      <div style={{ width: "320px" }}>
        <RichTextField
          {...args}
          editor={{
            ...args.editor,
            value,
            onValueChange: setValue,
          }}
        />
        <Paragraph style={{ marginTop: "16px", fontSize: "14px", color: "#666" }}>
          Current HTML: {value || "(empty)"}
        </Paragraph>
      </div>
    )
  },
}
