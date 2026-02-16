import { Input } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Input/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    tone: {
      control: "select",
      options: ["default", "danger", "success"],
    },
  },
  args: {
    placeholder: "Type something…",
  },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithValue: Story = {
  args: {
    defaultValue: "hello@marwes.dev",
  },
}

export const Invalid: Story = {
  args: {
    invalid: true,
    tone: "danger",
    placeholder: "Invalid input…",
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: "Disabled",
  },
}
