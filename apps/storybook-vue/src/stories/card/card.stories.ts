import { storybookLayout } from "@marwes-ui/core"
import type { CardProps } from "@marwes-ui/vue"
import { Card } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

const meta = {
  title: "Card/Atom",
  component: Card as unknown as object,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
} satisfies Meta<CardProps>

export default meta
type Story = StoryObj<CardProps>

export const Default: Story = {
  render: () => ({
    components: { Card },
    template: `
      <Card>This is the card body. Use it to display any content.</Card>
    `,
  }),
}

export const WithTitle: Story = {
  render: () => ({
    components: { Card },
    template: `
      <Card>
        <template #title>Card title</template>
        This is the card body. Use it to display any content.
      </Card>
    `,
  }),
}

export const AllVariants: Story = {
  render: () => ({
    components: { Card },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; width: 360px;">
        <Card>
          <template #title>With title</template>
          Cards with a title render a header area above the body content.
        </Card>
        <Card>
          Cards without a title receive full top padding.
        </Card>
      </div>
    `,
  }),
}

export const DarkVariants: Story = {
  render: () => ({
    components: { Card },
    template: `
      <div class="mw-theme--dark" style="display: flex; flex-direction: column; gap: 16px; width: 360px; padding: 24px; background: #111827; border-radius: 8px;">
        <Card>
          <template #title>Dark card</template>
          Surface, border, title and body adapt to dark mode automatically.
        </Card>
        <Card>Body-only card in dark mode.</Card>
      </div>
    `,
  }),
}
