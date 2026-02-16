import { iconRegistry } from "@marwes-ui/core"
import { type Button, CreateButton } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"

const iconNames = Object.keys(iconRegistry) as Array<keyof typeof iconRegistry>

const meta = {
  title: "Buttons/Purpose/CreateButton",
  component: CreateButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    tone: {
      control: "select",
      options: ["primary", "secondary", "text"],
    },
    iconLeft: {
      control: "select",
      options: [undefined, ...iconNames],
    },
    iconRight: {
      control: "select",
      options: [undefined, ...iconNames],
    },
    disabled: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof Button>

export default meta

export const CreateExample: StoryObj<typeof CreateButton> = {
  args: {
    children: "Create",
    iconRight: "plus",
  },
}
