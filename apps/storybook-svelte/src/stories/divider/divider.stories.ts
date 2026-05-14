import { storybookA11yPolicy, storybookDividerArgTypes, storybookLayout } from "@marwes-ui/core"
import type { Meta, StoryObj } from "@storybook/svelte"
import DividerPreview from "./DividerPreview.svelte"
import DividerShowcase from "./DividerShowcase.svelte"

const meta = {
  title: "Divider/Atom",
  component: DividerPreview,
  parameters: {
    ...storybookLayout.padded,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
  argTypes: storybookDividerArgTypes,
  args: {
    size: "md",
    orientation: "horizontal",
  },
} satisfies Meta<typeof DividerPreview>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Hairline: Story = { args: { size: "xxs" } }
export const Small: Story = { args: { size: "sm" } }
export const Large: Story = { args: { size: "lg" } }
export const ExtraLarge: Story = { args: { size: "xxl" } }

export const Vertical: Story = {
  args: { orientation: "vertical", size: "sm" },
}

export const AllSizes: Story = {
  render: () => ({
    Component: DividerShowcase,
    props: { showcase: "all-sizes" },
  }),
}

export const VerticalSizes: Story = {
  render: () => ({
    Component: DividerShowcase,
    props: { showcase: "vertical-sizes" },
  }),
}

export const WithContent: Story = {
  render: () => ({
    Component: DividerShowcase,
    props: { showcase: "with-content" },
  }),
}

export const VisualHierarchy: Story = {
  render: () => ({
    Component: DividerShowcase,
    props: { showcase: "visual-hierarchy" },
  }),
}
