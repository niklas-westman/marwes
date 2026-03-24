import { storybookButtonGeneralArgTypes, storybookLayout } from "@marwes-ui/core"
import { Button } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"

const meta = {
  title: "Buttons/Atom/Button",
  component: Button,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
  argTypes: {
    ...storybookButtonGeneralArgTypes,
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Basic: Story = {
  args: {
    children: "Base Button",
    variant: "primary",
    action: "button",
  },
}

export const AsLink: Story = {
  args: {
    children: "Go to docs",
    href: "https://example.com",
    action: "navigate",
    variant: "secondary",
  },
}

export const Loading: Story = {
  args: {
    children: "Saving...",
    loading: true,
    variant: "primary",
    action: "submit",
  },
}
