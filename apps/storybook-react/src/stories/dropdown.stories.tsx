import { Dropdown } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react-vite"

const sampleOptions = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
  { value: "option3", label: "Option 3" },
  { value: "option4", label: "Disabled Option", disabled: true },
]

const meta = {
  title: "Forms/Dropdown",
  component: Dropdown,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    tone: {
      control: "select",
      options: ["default", "danger", "success"],
    },
    size: {
      control: "radio",
      options: ["sm", "md", "lg"],
    },
    disabled: {
      control: "boolean",
    },
    invalid: {
      control: "boolean",
    },
  },
  args: {
    options: sampleOptions,
    placeholder: "Select an option…",
  },
} satisfies Meta<typeof Dropdown>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithPlaceholder: Story = {
  args: {
    placeholder: "Choose a country…",
    options: [
      { value: "us", label: "United States" },
      { value: "uk", label: "United Kingdom" },
      { value: "de", label: "Germany" },
      { value: "fr", label: "France" },
      { value: "se", label: "Sweden" },
    ],
  },
}

export const WithDefaultValue: Story = {
  args: {
    defaultValue: "option2",
  },
}

export const Small: Story = {
  args: {
    size: "sm",
  },
}

export const Medium: Story = {
  args: {
    size: "md",
  },
}

export const Large: Story = {
  args: {
    size: "lg",
  },
}

export const Invalid: Story = {
  args: {
    invalid: true,
    tone: "danger",
    placeholder: "Please select…",
  },
}

export const Success: Story = {
  args: {
    tone: "success",
    defaultValue: "option1",
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: "option1",
  },
}
