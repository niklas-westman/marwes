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
const DEMO_WIDTH = "120px"
const SELECT_FIELD_LABEL = ""
const selectFieldStoryStyles = `
  .mw-select-field-story-preview {
    width: ${DEMO_WIDTH};
    min-width: ${DEMO_WIDTH};
    max-width: ${DEMO_WIDTH};
    inline-size: ${DEMO_WIDTH};
    min-inline-size: ${DEMO_WIDTH};
    max-inline-size: ${DEMO_WIDTH};
  }

  .mw-select-field-story-preview .mw-input-field,
  .mw-select-field-story-preview .mw-input-field__input-wrapper,
  .mw-select-field-story-preview .mw-select-field__control,
  .mw-select-field-story-preview .mw-select-field__trigger,
  .mw-select-field-story-preview .mw-select__control,
  .mw-select-field-story-preview .mw-select {
    width: 100%;
    min-width: 0;
    max-width: 100%;
    inline-size: 100%;
    min-inline-size: 0;
    max-inline-size: 100%;
  }
`

type SelectFieldStoryArgs = SelectFieldProps & {
  native: boolean
}

function renderSelectField(args: SelectFieldStoryArgs) {
  const { native, select, ...fieldProps } = args

  return (
    <>
      <style>{selectFieldStoryStyles}</style>
      <div className="mw-select-field-story-preview">
        <SelectField {...fieldProps} label={SELECT_FIELD_LABEL} select={{ ...select, native }} />
      </div>
    </>
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
    label: {
      control: false,
      table: {
        disable: true,
      },
    },
  },
  args: {
    native: false,
    select: {
      placeholder: "Option",
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
    error: "Option is required.",
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
      placeholder: "Option",
      required: true,
    },
  },
}

export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState("us")
    const { native, select, ...fieldProps } = args

    return (
      <div style={{ display: "grid", gap: "16px", justifyItems: "start" }}>
        <style>{selectFieldStoryStyles}</style>
        <div className="mw-select-field-story-preview">
          <SelectField
            {...fieldProps}
            label={SELECT_FIELD_LABEL}
            select={{
              ...select,
              native,
              value,
              onValueChange: setValue,
            }}
          />
        </div>
        <Paragraph style={{ fontSize: "14px", color: "#666" }}>
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
