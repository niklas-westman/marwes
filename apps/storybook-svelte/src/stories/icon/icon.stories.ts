import { storybookLayout } from "@marwes-ui/core"
import { Icon } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"

const meta = {
  title: "Data Display/Atom/Icon",
  component: Icon,
  parameters: {
    ...storybookLayout.centered,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Icon>

export default meta
type Story = StoryObj<typeof meta>

export const Heart: Story = { args: { name: "heart", size: "md" } }
export const Star: Story = { args: { name: "star", size: "md" } }
export const Search: Story = { args: { name: "search", size: "md" } }
export const Settings: Story = { args: { name: "settings", size: "md" } }
export const Small: Story = { args: { name: "heart", size: "sm" } }
export const Large: Story = { args: { name: "heart", size: "lg" } }
