import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { ProductCard } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"

const meta = {
  title: "Card/Purpose/ProductCard",
  component: ProductCard,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ProductCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: "Pro plan",
    children: "Unlimited projects, advanced analytics, and priority support.",
  },
}
