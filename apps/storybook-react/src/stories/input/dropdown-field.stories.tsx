import { storybookA11yPolicy } from "@marwes-ui/core"
import { DropdownField, Paragraph } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"

const options = [
  { value: "se", label: "Sweden" },
  { value: "us", label: "United States" },
  { value: "no", label: "Norway" },
]

const FIGMA_DROPDOWN_NODE = "1364:7701"
const DEMO_WIDTH = "320px"
const DEMO_MIN_HEIGHT = "188px"

type DropdownFieldStoryArgs = React.ComponentProps<typeof DropdownField> & {
  native: boolean
}

function renderDropdownField(args: DropdownFieldStoryArgs) {
  const { native, select, ...fieldProps } = args

  return (
    <div style={{ width: DEMO_WIDTH, minHeight: DEMO_MIN_HEIGHT }}>
      <DropdownField {...fieldProps} select={{ ...select, native }} />
    </div>
  )
}

const meta: Meta<DropdownFieldStoryArgs> = {
  title: "Input/Purpose/DropdownField",
  component: DropdownField,
  parameters: {
    ...storybookA11yPolicy.smoke,
    layout: "centered",
    docs: {
      description: {
        component: `Semantic wrapper for the Marwes/Figma dropdown field. native={false} (default) uses the custom open-state from node ${FIGMA_DROPDOWN_NODE}; native={true} falls back to the browser dropdown.`,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    native: {
      control: "boolean",
      description: `Use native={false} for the custom Marwes dropdown field (${FIGMA_DROPDOWN_NODE}) or native={true} for browser select chrome.`,
    },
  },
  args: {
    native: false,
    label: "Country",
    select: {
      placeholder: "Choose a country",
      options,
    },
  },
  render: renderDropdownField,
}

export default meta

type Story = StoryObj<DropdownFieldStoryArgs>

export const Basic: Story = {}

export const WithHelperText: Story = {
  args: {
    helperText: "Used to tailor currency and shipping defaults.",
  },
}

export const WithError: Story = {
  args: {
    error: "Country is required.",
  },
}

export const Disabled: Story = {
  args: {
    select: {
      options,
      defaultValue: "se",
      disabled: true,
    },
  },
}

export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState("us")
    const { native, select, ...fieldProps } = args

    return (
      <div style={{ width: DEMO_WIDTH, minHeight: DEMO_MIN_HEIGHT }}>
        <DropdownField
          {...fieldProps}
          select={{
            ...select,
            native,
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

export const Native: Story = {
  args: {
    native: true,
  },
}
