import { BadgeVariant, storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { Badge } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"
import BadgeDarkGallery from "./BadgeDarkGallery.svelte"
import BadgeGallery from "./BadgeGallery.svelte"

const VARIANTS = Object.values(BadgeVariant)

const meta = {
  title: "Badge/Atom",
  component: Badge,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: VARIANTS,
    },
    ariaLabel: { control: "text" },
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { children: "Neutral", variant: "neutral" },
}

export const AllVariants: Story = {
  render: () => ({
    Component: BadgeGallery,
    props: {},
  }),
}

export const DarkVariants: Story = {
  render: () => ({
    Component: BadgeDarkGallery,
    props: {},
  }),
}
