import { Paragraph, Select } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"

const options = [
  { value: "starter", label: "Starter" },
  { value: "growth", label: "Growth" },
  { value: "enterprise", label: "Enterprise" },
]

const FIGMA_SELECT_NODE = "1364:7707"

const meta: Meta<typeof Select> = {
  title: "Input/Atom/Select",
  component: Select,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `Compact select atom. Use native={false} for the Marwes visual treatment from Figma node ${FIGMA_SELECT_NODE}, or native={true} for platform chrome.`,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    native: {
      control: "boolean",
      description: `Use native={false} for the compact Marwes select atom (${FIGMA_SELECT_NODE}) or native={true} for browser chrome.`,
    },
  },
  args: {
    native: false,
    placeholder: "Choose a plan",
    options,
  },
}

export default meta

type Story = StoryObj<typeof Select>

export const Basic: Story = {}

export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState("growth")

    return (
      <div style={{ width: "320px" }}>
        <Select {...args} value={value} onValueChange={setValue} />
        <Paragraph style={{ marginTop: "16px", fontSize: "14px", color: "#666" }}>
          Current value: {value || "(empty)"}
        </Paragraph>
      </div>
    )
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: "growth",
  },
}

export const Invalid: Story = {
  args: {
    invalid: true,
    defaultValue: "starter",
    describedBy: "select-error",
  },
  render: (args) => (
    <div style={{ width: "320px" }}>
      <Select {...args} />
      <Paragraph id="select-error" size="sm" style={{ marginTop: "8px" }}>
        Invalid state for validation errors.
      </Paragraph>
    </div>
  ),
}
