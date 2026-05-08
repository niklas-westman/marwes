import { storybookA11yPolicy, storybookLayout, storybookSpacingArgTypes } from "@marwes-ui/core"
import { Spacing } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"
import SpacingShowcase from "./SpacingShowcase.svelte"

const meta = {
  title: "Spacing/Atom",
  component: Spacing,
  parameters: {
    ...storybookLayout.padded,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
  argTypes: storybookSpacingArgTypes,
  args: {
    size: "sp-24",
  },
} satisfies Meta<typeof Spacing>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const ExtraSmall: Story = {
  args: { size: "sp-8" },
}

export const Small: Story = {
  args: { size: "sp-16" },
}

export const Large: Story = {
  args: { size: "sp-32" },
}

export const ExtraLarge: Story = {
  args: { size: "sp-40" },
}

export const AllSizes: Story = {
  render: () => ({
    Component: SpacingShowcase,
    props: { showcase: "all-sizes" },
  }),
}

export const InContext: Story = {
  render: () => ({
    Component: SpacingShowcase,
    props: { showcase: "in-context" },
  }),
}
