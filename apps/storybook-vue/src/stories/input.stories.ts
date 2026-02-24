import type { InputProps } from "@marwes-ui/vue"
import { Input } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

const meta = {
  title: "Input/Input",
  component: Input as unknown as object,
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
} satisfies Meta<InputProps>

export default meta
type Story = StoryObj<InputProps>

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
