import { Paragraph, RichText } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"

const meta: Meta<typeof RichText> = {
  title: "Input/Atom/RichText",
  component: RichText,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Rich text editor for the Input family. This is a manual-review-heavy component: automated tests protect naming, readonly/disabled semantics, and basic formatting affordances, but real editing behavior should still be checked in supported browser and assistive technology combinations.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    placeholder: "Write a formatted description...",
  },
}

export default meta

type Story = StoryObj<typeof RichText>

export const Basic: Story = {}

export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState("<p>Hello <strong>world</strong></p>")

    return (
      <div style={{ width: "320px" }}>
        <RichText {...args} value={value} onValueChange={setValue} />
        <Paragraph style={{ marginTop: "16px", fontSize: "14px", color: "#666" }}>
          Current HTML: {value || "(empty)"}
        </Paragraph>
      </div>
    )
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    value: "<p><strong>Locked</strong> formatted content</p>",
  },
}

export const ReadOnly: Story = {
  args: {
    readOnly: true,
    value: "<p><em>Read-only</em> summary with <u>underline</u></p>",
  },
}

export const LimitedFormats: Story = {
  args: {
    allowedFormats: ["bold", "italic"],
    value: "<p>Underline is intentionally disabled in this example.</p>",
  },
}
