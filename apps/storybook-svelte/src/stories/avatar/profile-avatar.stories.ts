import { AvatarSize, AvatarType, storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { ProfileAvatar } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"

const meta = {
  title: "Avatar/Purpose/ProfileAvatar",
  component: ProfileAvatar,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ProfileAvatar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { size: "medium", initials: "NW" },
}
