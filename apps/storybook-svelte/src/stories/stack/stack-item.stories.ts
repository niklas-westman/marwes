import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import type { StackItemProps } from "@marwes-ui/svelte"
import { StackItem, stackSizings } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"
import StackShowcase from "./StackShowcase.svelte"

const meta = {
  title: "Stack/Item",
  component: StackItem,
  parameters: {
    ...storybookLayout.padded,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
  argTypes: {
    horizontalSizing: { control: "inline-radio", options: [...stackSizings] },
    verticalSizing: { control: "inline-radio", options: [...stackSizings] },
  },
  args: {
    horizontalSizing: "hug",
    verticalSizing: "hug",
  },
  render: (args: StackItemProps) => ({
    Component: StackShowcase,
    props: { showcase: "item", itemProps: args },
  }),
} satisfies Meta<typeof StackItem>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Fill: Story = {
  args: { horizontalSizing: "fill", verticalSizing: "fill" },
}

export const ListItems: Story = {
  render: () => ({
    Component: StackShowcase,
    props: { showcase: "list-items" },
  }),
}
