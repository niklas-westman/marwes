import { BadgeVariant, storybookLayout } from "@marwes-ui/core"
import type { BadgeProps } from "@marwes-ui/vue"
import { Badge, MarwesProvider } from "@marwes-ui/vue"
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
  args: { variant: BadgeVariant.neutral },
  render: (args) => ({
    components: { Badge, MarwesProvider },
    setup() {
      return { args }
    },
    template: `<Badge v-bind="args">Neutral</Badge>`,
  }),
}

export const AllVariants: Story = {
  args: { ariaLabel: "Badge example" },
  argTypes: {
    id: { control: false, table: { disable: true } },
    variant: { control: false, table: { disable: true } },
  },
  render: (args) => ({
    components: { Badge },
    setup() {
      return { args, variants: VARIANTS }
    },
    template: `
      <div style="display: flex; flex-wrap: wrap; gap: 8px; align-items: center;">
        <Badge v-for="variant in variants" :key="variant" v-bind="args" :variant="variant">
          {{ variant.charAt(0).toUpperCase() + variant.slice(1) }}
        </Badge>
      </div>
    `,
  }),
}

export const DarkVariants: Story = {
  args: { ariaLabel: "Badge example" },
  argTypes: {
    id: { control: false, table: { disable: true } },
    variant: { control: false, table: { disable: true } },
  },
  render: (args) => ({
    components: { Badge },
    setup() {
      return { args, variants: VARIANTS }
    },
    template: `
      <MarwesProvider :theme="{ mode: 'dark' }">
        <div style="display: flex; flex-wrap: wrap; gap: 8px; align-items: center; padding: 16px; background: #111827; border-radius: 8px;">
          <Badge v-for="variant in variants" :key="variant" v-bind="args" :variant="variant">
            {{ variant.charAt(0).toUpperCase() + variant.slice(1) }}
          </Badge>
        </div>
      </MarwesProvider>
    `,
  }),
}
