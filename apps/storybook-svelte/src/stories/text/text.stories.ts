import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { Text } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"
import TextShowcase from "./TextShowcase.svelte"

const meta = {
  title: "Text/Atom",
  component: Text,
  parameters: {
    ...storybookLayout.padded,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["display", "label", "label-small", "caption", "overline", "micro"],
    },
    as: {
      control: "select",
      options: ["span", "div", "label", "small", "strong"],
    },
  },
} satisfies Meta<typeof Text>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: "Caption text",
  },
}

export const Label: Story = {
  render: () => ({
    Component: TextShowcase,
    props: { story: "label" },
  }),
}

export const LabelSmall: Story = {
  render: () => ({
    Component: TextShowcase,
    props: { story: "label-small" },
  }),
}

export const Caption: Story = {
  render: () => ({
    Component: TextShowcase,
    props: { story: "caption" },
  }),
}

export const Overline: Story = {
  render: () => ({
    Component: TextShowcase,
    props: { story: "overline" },
  }),
}

export const Micro: Story = {
  render: () => ({
    Component: TextShowcase,
    props: { story: "micro" },
  }),
}

export const AllVariants: Story = {
  render: () => ({
    Component: TextShowcase,
    props: { story: "all-variants" },
  }),
}
