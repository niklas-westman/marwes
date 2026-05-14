import { BadgeVariant, storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { PriorityBadge } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"
import AllPrioritiesGallery from "./AllPriorities.svelte"

const meta = {
  title: "Badge/Purpose/Priority",
  component: PriorityBadge,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: Object.values(BadgeVariant),
    },
  },
} satisfies Meta<typeof PriorityBadge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { children: "High", variant: BadgeVariant.warning },
}

export const AllPriorities: Story = {
  render: () => ({
    Component: AllPrioritiesGallery,
    props: {},
  }),
}
