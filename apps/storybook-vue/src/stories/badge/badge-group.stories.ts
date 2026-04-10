import { BadgeVariant, storybookLayout } from "@marwes-ui/core"
import type { BadgeGroupProps } from "@marwes-ui/vue"
import { Badge, BadgeGroup } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

const VARIANTS = Object.values(BadgeVariant)

const meta = {
  title: "Badge/Molecule",
  component: BadgeGroup as unknown as object,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
  decorators: [() => ({ template: '<div style="width: 100%; max-width: 640px"><story /></div>' })],
} satisfies Meta<BadgeGroupProps>

export default meta
type Story = StoryObj<BadgeGroupProps>

export const Default: Story = {
  args: { label: "Tags" },
  render: (args) => ({
    components: { BadgeGroup, Badge },
    setup() {
      return { args, BadgeVariant }
    },
    template: `
      <BadgeGroup v-bind="args">
        <Badge :variant="BadgeVariant.info">Frontend</Badge>
        <Badge :variant="BadgeVariant.success">Approved</Badge>
        <Badge :variant="BadgeVariant.warning">Review</Badge>
      </BadgeGroup>
    `,
  }),
}

export const AllVariants: Story = {
  args: { label: "All Variants" },
  render: (args) => ({
    components: { BadgeGroup, Badge },
    setup() {
      return { args, variants: VARIANTS }
    },
    template: `
      <BadgeGroup v-bind="args">
        <Badge v-for="variant in variants" :key="variant" :variant="variant">
          {{ variant.charAt(0).toUpperCase() + variant.slice(1) }}
        </Badge>
      </BadgeGroup>
    `,
  }),
}

export const WithCustomClass: Story = {
  args: {
    label: "Custom Styled",
    className: "custom-badge-group",
  },
  render: (args) => ({
    components: { BadgeGroup, Badge },
    setup() {
      return { args }
    },
    template: `
      <BadgeGroup v-bind="args">
        <Badge>Alpha</Badge>
        <Badge>Beta</Badge>
      </BadgeGroup>
    `,
  }),
}
