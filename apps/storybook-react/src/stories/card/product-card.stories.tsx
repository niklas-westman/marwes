import { storybookLayout } from "@marwes-ui/core"
import { ProductCard } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof ProductCard> = {
  title: "Card/Purpose/ProductCard",
  component: ProductCard,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof ProductCard>

export const Default: Story = {
  args: {
    title: "Pro plan",
    children: "Unlimited projects, advanced analytics, and priority support.",
  },
}
