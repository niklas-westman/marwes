import { iconRegistry } from "@marwes/core"
import { LinkButton } from "@marwes/react"
import type { Meta, StoryObj } from "@storybook/react"

const iconNames = Object.keys(iconRegistry) as Array<keyof typeof iconRegistry>

const meta = {
  title: "Buttons/Purpose/LinkButton",
  component: LinkButton,
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
} satisfies Meta<typeof LinkButton>

export default meta

export const LinkExample: StoryObj<typeof LinkButton> = {
  render: () => <LinkButton href="/dashboard">Go to Dashboard</LinkButton>,
  parameters: {
    docs: {
      description: {
        story: "LinkButton renders as an anchor tag with button styling and navigation metadata.",
      },
    },
  },
}
