import { AvatarSize, AvatarType, storybookLayout } from "@marwes-ui/core"
import { ProfileAvatar } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof ProfileAvatar> = {
  title: "Avatar/Purpose/ProfileAvatar",
  component: ProfileAvatar,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
}

export default meta

type Story = StoryObj<typeof ProfileAvatar>

export const Default: Story = {
  args: {
    size: AvatarSize.medium,
    type: AvatarType.initials,
    initials: "NW",
  },
}
