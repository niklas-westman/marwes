import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { SuccessToast } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"

const meta = {
  title: "Toast/Purpose/SuccessToast",
  component: SuccessToast,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof SuccessToast>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: "Operation completed",
  },
}
