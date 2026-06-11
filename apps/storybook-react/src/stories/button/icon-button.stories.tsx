import { storybookA11yPolicy, storybookIconButtonArgTypes, storybookLayout } from "@marwes-ui/core"
import { IconButton } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"

const meta = {
  title: "Button/Molecule/IconButton",
  component: IconButton,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
  argTypes: {
    ...storybookIconButtonArgTypes,
    ariaLabel: { control: "text" },
  },
} satisfies Meta<typeof IconButton>

export default meta
type Story = StoryObj<typeof meta>

export const Basic: Story = {
  args: {
    icon: "x",
    ariaLabel: "Close",
    variant: "neutral",
  },
}

export const Danger: Story = {
  args: {
    icon: "trash",
    ariaLabel: "Delete",
    variant: "danger",
    action: "delete",
  },
}
