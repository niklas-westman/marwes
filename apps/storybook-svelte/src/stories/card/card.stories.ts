import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { Card } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"
import CardRichContent from "./CardRichContent.svelte"
import CardStateMatrix from "./CardStateMatrix.svelte"

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

export const Default: Story = {
  args: {
    title: "Card title",
    children: "This is the card body. Use it to display any content.",
  },
}

export const BodyOnly: Story = {
  args: {
    children: "A card without a title keeps the same 24px outer padding from Figma.",
  },
}

export const RichContent: Story = {
  render: () => ({
    Component: CardRichContent,
    props: {},
  }),
}

export const StateMatrix: Story = {
  render: () => ({
    Component: CardStateMatrix,
    props: {},
  }),
}
