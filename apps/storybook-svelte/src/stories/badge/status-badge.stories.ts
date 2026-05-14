import { BadgeVariant, storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { StatusBadge } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"
import AllStatusesGallery from "./AllStatuses.svelte"

const meta = {
  title: "Badge/Purpose/Status",
  component: StatusBadge,
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
} satisfies Meta<typeof StatusBadge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { children: "Active", variant: BadgeVariant.success },
}

export const AllStatuses: Story = {
  render: () => ({
    Component: AllStatusesGallery,
    props: {},
  }),
}
