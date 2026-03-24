import { storybookLayout } from "@marwes-ui/core"
import type { BadgeGroupProps } from "@marwes-ui/vue"
import { Badge, BadgeGroup } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

const VARIANTS = ["neutral", "brand", "info", "success", "warning", "error"] as const

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
  render: () => ({
    components: { BadgeGroup, Badge },
    template: `
      <BadgeGroup label="Tags">
        <Badge variant="info">Frontend</Badge>
        <Badge variant="success">Approved</Badge>
        <Badge variant="warning">Review</Badge>
      </BadgeGroup>
    `,
  }),
}

export const AllVariants: Story = {
  render: () => ({
    components: { BadgeGroup, Badge },
    setup() {
      return { variants: VARIANTS }
    },
    template: `
      <BadgeGroup label="All Variants">
        <Badge v-for="v in variants" :key="v" :variant="v">
          {{ v.charAt(0).toUpperCase() + v.slice(1) }}
        </Badge>
      </BadgeGroup>
    `,
  }),
}

export const WithCustomClass: Story = {
  render: () => ({
    components: { BadgeGroup, Badge },
    template: `
      <BadgeGroup label="Custom Styled" className="custom-badge-group">
        <Badge variant="brand">Alpha</Badge>
        <Badge variant="brand">Beta</Badge>
      </BadgeGroup>
    `,
  }),
}
