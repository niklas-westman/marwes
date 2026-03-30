import { storybookLayout } from "@marwes-ui/core"
import { ProfileCard } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof ProfileCard> = {
  title: "Card/Purpose/ProfileCard",
  component: ProfileCard,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof ProfileCard>

export const Default: Story = {
  args: {
    title: "Niklas Westman",
    children: "Design systems engineer with ownership of component primitives.",
  },
}
