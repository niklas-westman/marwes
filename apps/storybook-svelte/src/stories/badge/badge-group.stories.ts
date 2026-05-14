import { BadgeVariant, storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import type { Meta, StoryObj } from "@storybook/svelte"
import BadgeGroupStory from "./BadgeGroupStory.svelte"

const meta = {
  title: "Badge/Molecule",
  component: BadgeGroupStory,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof BadgeGroupStory>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: "Tags",
    badges: [
      { variant: BadgeVariant.info, children: "Frontend" },
      { variant: BadgeVariant.success, children: "Approved" },
      { variant: BadgeVariant.warning, children: "Review" },
    ],
  },
}

export const AllVariants: Story = {
  args: {
    label: "All Variants",
    badges: Object.values(BadgeVariant).map((variant) => ({
      variant,
      children: variant.charAt(0).toUpperCase() + variant.slice(1),
    })),
  },
}

export const WithCustomClass: Story = {
  args: {
    label: "Custom Styled",
    className: "custom-badge-group",
    badges: [
      { variant: BadgeVariant.neutral, children: "Alpha" },
      { variant: BadgeVariant.neutral, children: "Beta" },
    ],
  },
}
