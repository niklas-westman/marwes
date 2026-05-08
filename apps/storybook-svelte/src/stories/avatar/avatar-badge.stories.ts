import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { AvatarBadge } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"
import AvatarBadgeGallery from "./AvatarBadgeGallery.svelte"

const meta = {
  title: "Avatar/Molecule/AvatarBadge",
  component: AvatarBadge,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof AvatarBadge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { initials: "MW", size: "medium" },
}

export const Small: Story = {
  args: { initials: "MW", size: "small" },
}

export const Large: Story = {
  args: { initials: "MW", size: "large" },
}

export const AllSizes: Story = {
  render: () => ({
    Component: AvatarBadgeGallery,
    props: {},
  }),
}

export const DarkSizes: Story = {
  render: () => ({
    Component: AvatarBadgeGallery,
    props: {},
  }),
}
