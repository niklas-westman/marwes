import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { Avatar } from "@marwes-ui/vue"
import type { AvatarProps } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"
import AvatarGallery from "./AvatarGallery.vue"

const meta = {
  title: "Avatar/Atom",
  component: Avatar as unknown as object,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["small", "medium", "large"] },
    type: { control: "select", options: ["icon", "initials", "image"] },
    initials: { control: "text" },
    ariaLabel: { control: "text" },
  },
} satisfies Meta<AvatarProps>

export default meta

type Story = StoryObj<AvatarProps>

export const Icon: Story = { args: { type: "icon", ariaLabel: "User avatar" } }
export const Initials: Story = { args: { initials: "NW", ariaLabel: "Niklas Westman" } }
export const Image: Story = { args: { src: "https://i.pravatar.cc/80", alt: "User photo" } }
export const Small: Story = { args: { initials: "SM", size: "small", ariaLabel: "Small" } }
export const Large: Story = { args: { initials: "LG", size: "large", ariaLabel: "Large" } }

export const AllVariants: Story = {
  render: () => ({
    components: { AvatarGallery },
    template: "<AvatarGallery />",
  }),
}
