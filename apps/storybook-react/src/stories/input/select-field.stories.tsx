import { Paragraph, SelectField } from "@marwes-ui/react"
import type { SelectFieldProps } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"

const options = [
  { value: "se", label: "Sweden" },
  { value: "us", label: "United States" },
  { value: "no", label: "Norway" },
]

const FIGMA_DROPDOWN_NODE = "1364:7701"
const DEMO_WIDTH = "320px"

type SelectFieldStoryArgs = SelectFieldProps & {
  native: boolean
}

function renderSelectField(args: SelectFieldStoryArgs) {
  const { native, select, ...fieldProps } = args

  return (
    <div style={{ width: DEMO_WIDTH }}>
      <SelectField {...fieldProps} select={{ ...select, native }} />
    </div>
  )
}

const meta: Meta<SelectFieldStoryArgs> = {
  title: "Input/Molecule/SelectField",
  component: SelectField,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `Field-wrapped select. native={false} (default) renders the custom Marwes dropdown open-state for node ${FIGMA_DROPDOWN_NODE}; native={true} keeps browser chrome.`,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    native: {
      control: "boolean",
      description: `Use native={false} for the Marwes dropdown field (${FIGMA_DROPDOWN_NODE}) or native={true} for browser select chrome.`,
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
  render: renderSelectField,
}

export default meta

type Story = StoryObj<SelectFieldStoryArgs>

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

export const Required: Story = {
  args: {
    helperText: "Required for tax calculation.",
    select: {
      options,
      placeholder: "Choose a country",
      required: true,
    },
  },
}

export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState("us")
    const { native, select, ...fieldProps } = args

    return (
      <div style={{ width: DEMO_WIDTH }}>
        <SelectField
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
