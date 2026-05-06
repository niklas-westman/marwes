import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { ErrorToast } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof ErrorToast> = {
  title: "Toast/Purpose/ErrorToast",
  component: ErrorToast,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
}

export default meta

type Story = StoryObj<typeof ErrorToast>

export const Default: Story = {
  args: {
    children: "Publishing failed. Please try again.",
  },
}
