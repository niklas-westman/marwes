import { AvatarSize, storybookLayout } from "@marwes-ui/core"
import { PresenceAvatar } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof PresenceAvatar> = {
  title: "Avatar/Purpose/PresenceAvatar",
  component: PresenceAvatar,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
}

export default meta

type Story = StoryObj<typeof PresenceAvatar>

export const Default: Story = {
  args: {
    size: AvatarSize.medium,
    initials: "NW",
    statusLabel: "Online",
  },
}
