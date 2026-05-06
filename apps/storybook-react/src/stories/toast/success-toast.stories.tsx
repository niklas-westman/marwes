import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { SuccessToast } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof SuccessToast> = {
  title: "Toast/Purpose/SuccessToast",
  component: SuccessToast,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
}

export default meta

type Story = StoryObj<typeof SuccessToast>

export const Default: Story = {
  args: {
    children: "Project saved successfully.",
  },
}
