import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { AvatarGroup } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"
import AvatarGroupDark from "./AvatarGroupDark.svelte"

const sampleItems = [
  { id: "mw", initials: "MW" },
  { id: "nk", initials: "NK" },
  { id: "as", initials: "AS" },
  { id: "guest", type: "icon" as const, ariaLabel: "Guest member" },
]

const meta = {
  title: "Avatar/Molecule/AvatarGroup",
  component: AvatarGroup,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof AvatarGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    ariaLabel: "Project members",
    items: sampleItems,
    overflowCount: 3,
  },
}

export const WithoutOverflow: Story = {
  args: {
    ariaLabel: "Design reviewers",
    items: sampleItems,
  },
}

export const DarkPreview: Story = {
  render: () => ({
    Component: AvatarGroupDark,
    props: {},
  }),
}
