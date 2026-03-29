import { BadgeVariant, storybookLayout } from "@marwes-ui/core"
import type { BadgeProps } from "@marwes-ui/vue"
import { Badge } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

const VARIANTS = Object.values(BadgeVariant)

const meta = {
  title: "Badge/Atom",
  component: Badge as unknown as object,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: VARIANTS,
    },
    ariaLabel: { control: "text" },
  },
} satisfies Meta<BadgeProps>

export default meta
type Story = StoryObj<BadgeProps>

export const Default: Story = {
  render: () => ({
    components: { Badge },
    setup() {
      return { BadgeVariant }
    },
    template: `<Badge :variant="BadgeVariant.neutral">Neutral</Badge>`,
  }),
}

export const AllVariants: Story = {
  render: () => ({
    components: { Badge },
    setup() {
      return { variants: VARIANTS }
    },
    template: `
      <div style="display: flex; flex-wrap: wrap; gap: 8px; align-items: center;">
        <Badge v-for="v in variants" :key="v" :variant="v">
          {{ v.charAt(0).toUpperCase() + v.slice(1) }}
        </Badge>
      </div>
    `,
  }),
}

export const DarkVariants: Story = {
  render: () => ({
    components: { Badge },
    setup() {
      return { variants: VARIANTS }
    },
    template: `
      <div class="mw-theme--dark" style="display: flex; flex-wrap: wrap; gap: 8px; align-items: center; padding: 16px; background: #111827; border-radius: 8px;">
        <Badge v-for="v in variants" :key="v" :variant="v">
          {{ v.charAt(0).toUpperCase() + v.slice(1) }}
        </Badge>
      </div>
    `,
  }),
}
