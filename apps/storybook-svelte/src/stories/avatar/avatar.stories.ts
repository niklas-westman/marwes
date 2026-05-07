import { storybookLayout } from "@marwes-ui/core"
import { Avatar } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"

const meta = {
  title: "Avatar/Atom",
  component: Avatar,
  parameters: { ...storybookLayout.centered },
  tags: ["autodocs"],
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

export const Icon: Story = { args: { type: "icon", ariaLabel: "User avatar" } }
export const Initials: Story = { args: { initials: "NW", ariaLabel: "Niklas Westman" } }
export const Image: Story = { args: { src: "https://i.pravatar.cc/80", alt: "User photo" } }
export const Small: Story = { args: { initials: "SM", size: "small", ariaLabel: "Small" } }
export const Large: Story = { args: { initials: "LG", size: "large", ariaLabel: "Large" } }
