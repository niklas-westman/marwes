import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { ProfileCard } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"

const meta = {
  title: "Card/Purpose/ProfileCard",
  component: ProfileCard,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ProfileCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: "Alex Morgan",
    children: "Design systems engineer with ownership of component primitives.",
  },
}
