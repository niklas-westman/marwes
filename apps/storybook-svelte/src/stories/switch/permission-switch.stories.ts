import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { PermissionSwitch } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"

const meta = {
  title: "Switch/Purpose/Permission",
  component: PermissionSwitch,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof PermissionSwitch>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: "Allow camera access",
    description: "Required for video calls and screen sharing.",
    switch: { checked: false },
  },
}
