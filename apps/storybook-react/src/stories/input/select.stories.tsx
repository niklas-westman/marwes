import { Paragraph, Select } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"

const options = [
  { value: "starter", label: "Starter" },
  { value: "growth", label: "Growth" },
  { value: "enterprise", label: "Enterprise" },
]

const FIGMA_SELECT_NODE = "1364:7707"
const SELECT_STORY_WIDTH = "120px"
const selectStoryStyles = `
  .mw-select-story-preview {
    width: ${SELECT_STORY_WIDTH};
    min-width: ${SELECT_STORY_WIDTH};
    max-width: ${SELECT_STORY_WIDTH};
    inline-size: ${SELECT_STORY_WIDTH};
    min-inline-size: ${SELECT_STORY_WIDTH};
    max-inline-size: ${SELECT_STORY_WIDTH};
  }

  .mw-select-story-preview .mw-select__control,
  .mw-select-story-preview .mw-select {
    width: 100%;
    min-width: 0;
    max-width: 100%;
    inline-size: 100%;
    min-inline-size: 0;
    max-inline-size: 100%;
  }
`

const meta: Meta<typeof Select> = {
  title: "Input/Atom/Select",
  component: Select,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `Compact select atom. Native browser select behavior is the default. Use native={false} for the Marwes visual treatment from Figma node ${FIGMA_SELECT_NODE} when you intentionally need the custom presentation.`,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    native: {
      control: "boolean",
      description: `Native browser select behavior is the default. Use native={false} for the compact Marwes select atom (${FIGMA_SELECT_NODE}) only when you intentionally want the custom presentation.`,
    },
  },
  args: {
    native: true,
    placeholder: "Choose a plan",
    options,
  },
}

export default meta

type Story = StoryObj<typeof Select>

export const Basic: Story = {
  render: (args) => (
    <>
      <style>{selectStoryStyles}</style>
      <div className="mw-select-story-preview">
        <Select {...args} />
      </div>
    </>
  ),
}

export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState("growth")

    return (
      <div style={{ display: "grid", gap: "16px", justifyItems: "start" }}>
        <style>{selectStoryStyles}</style>
        <div className="mw-select-story-preview">
          <Select {...args} value={value} onValueChange={setValue} />
        </div>
        <Paragraph style={{ fontSize: "14px", color: "#666" }}>
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
  render: (args) => (
    <>
      <style>{selectStoryStyles}</style>
      <div className="mw-select-story-preview">
        <Select {...args} />
      </div>
    </>
  ),
}

export const Invalid: Story = {
  args: {
    invalid: true,
    defaultValue: "starter",
    describedBy: "select-error",
  },
  render: (args) => (
    <div style={{ display: "grid", gap: "8px", justifyItems: "start" }}>
      <style>{selectStoryStyles}</style>
      <div className="mw-select-story-preview">
        <Select {...args} />
      </div>
      <Paragraph id="select-error" size="sm">
        Invalid state for validation errors.
      </Paragraph>
    </div>
  ),
}
