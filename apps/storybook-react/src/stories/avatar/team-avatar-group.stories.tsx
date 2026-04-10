import { storybookLayout } from "@marwes-ui/core"
import { TeamAvatarGroup } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof TeamAvatarGroup> = {
  title: "Avatar/Purpose/TeamAvatarGroup",
  component: TeamAvatarGroup,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
}

export default meta

type Story = StoryObj<typeof TeamAvatarGroup>

export const Default: Story = {
  args: {
    ariaLabel: "Product team",
    items: [
      { id: "nw", initials: "NW" },
      { id: "as", initials: "AS" },
      { id: "kl", initials: "KL" },
      { id: "guest", type: "icon", ariaLabel: "Guest member" },
    ],
    overflowCount: 3,
  },
}
