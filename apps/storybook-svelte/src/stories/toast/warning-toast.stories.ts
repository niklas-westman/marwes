import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { WarningToast } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"

const meta = {
  title: "Toast/Purpose/WarningToast",
  component: WarningToast,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof WarningToast>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: "Session expiring soon",
  },
}
