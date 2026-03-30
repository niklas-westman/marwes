import { storybookLayout } from "@marwes-ui/core"
import { WarningToast } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof WarningToast> = {
  title: "Toast/Purpose/WarningToast",
  component: WarningToast,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
}

export default meta

type Story = StoryObj<typeof WarningToast>

export const Default: Story = {
  args: {
    children: "Storage is almost full.",
  },
}
