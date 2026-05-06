import { AvatarSize, AvatarType, storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { ProfileAvatar } from "@marwes-ui/vue"
import type { ProfileAvatarProps } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

const meta = {
  title: "Avatar/Purpose/ProfileAvatar",
  component: ProfileAvatar as unknown as object,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
} satisfies Meta<ProfileAvatarProps>

export default meta

type Story = StoryObj<ProfileAvatarProps>

export const Default: Story = {
  args: {
    size: AvatarSize.medium,
    type: AvatarType.initials,
    initials: "NW",
  },
}
