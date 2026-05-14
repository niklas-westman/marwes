import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { ErrorToast } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"

const meta = {
  title: "Toast/Purpose/ErrorToast",
  component: ErrorToast,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ErrorToast>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: "Something went wrong",
  },
}
