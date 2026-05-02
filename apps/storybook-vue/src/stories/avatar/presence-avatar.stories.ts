import { AvatarSize, storybookLayout } from "@marwes-ui/core"
import { PresenceAvatar } from "@marwes-ui/vue"
import type { PresenceAvatarProps } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

const meta = {
  title: "Avatar/Purpose/PresenceAvatar",
  component: PresenceAvatar as unknown as object,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
} satisfies Meta<PresenceAvatarProps>

export default meta

type Story = StoryObj<PresenceAvatarProps>

export const Default: Story = {
  args: {
    size: AvatarSize.medium,
    initials: "NW",
    statusLabel: "Online",
  },
}
