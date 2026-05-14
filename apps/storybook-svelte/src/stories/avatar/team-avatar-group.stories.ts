import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { TeamAvatarGroup } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"

const meta = {
  title: "Avatar/Purpose/TeamAvatarGroup",
  component: TeamAvatarGroup,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof TeamAvatarGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    ariaLabel: "Project members",
    items: [
      { id: "mw", initials: "MW" },
      { id: "nk", initials: "NK" },
      { id: "as", initials: "AS" },
    ],
    overflowCount: 3,
  },
}
