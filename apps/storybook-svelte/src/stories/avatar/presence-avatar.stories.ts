import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { PresenceAvatar } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"

const meta = {
  title: "Avatar/Purpose/PresenceAvatar",
  component: PresenceAvatar,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof PresenceAvatar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { size: "medium", initials: "MW", statusLabel: "Online" },
}
