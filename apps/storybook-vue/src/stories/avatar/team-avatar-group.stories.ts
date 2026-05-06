import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { TeamAvatarGroup } from "@marwes-ui/vue"
import type { TeamAvatarGroupProps } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

const meta = {
  title: "Avatar/Purpose/TeamAvatarGroup",
  component: TeamAvatarGroup as unknown as object,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
} satisfies Meta<TeamAvatarGroupProps>

export default meta

type Story = StoryObj<TeamAvatarGroupProps>

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
