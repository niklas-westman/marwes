import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { Card } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"

const meta = {
  title: "Card/Atom",
  component: Card,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Basic: Story = {
  args: {
    title: "Getting started",
    children: "Install via pnpm and wrap your app with MarwesProvider.",
  },
}

export const BodyOnly: Story = {
  args: {
    children: "Body-only card — no title.",
  },
}
