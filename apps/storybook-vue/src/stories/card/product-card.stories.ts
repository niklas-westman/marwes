import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import type { CardProps } from "@marwes-ui/vue"
import { ProductCard } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

const meta = {
  title: "Card/Purpose/ProductCard",
  component: ProductCard as unknown as object,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
} satisfies Meta<CardProps>

export default meta
type Story = StoryObj<CardProps>

export const Default: Story = {
  render: () => ({
    components: { ProductCard },
    template: `
      <ProductCard>
        <template #title>Pro plan</template>
        Unlimited projects, advanced analytics, and priority support.
      </ProductCard>
    `,
  }),
}
