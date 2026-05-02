import { storybookLayout } from "@marwes-ui/core"
import { InfoToast } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof InfoToast> = {
  title: "Toast/Purpose/InfoToast",
  component: InfoToast,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
}

export default meta

type Story = StoryObj<typeof InfoToast>

export const Default: Story = {
  args: {
    children: "New release notes are available.",
  },
}
