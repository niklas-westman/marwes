import { storybookA11yPolicy, storybookLayout, storybookSkeletonArgTypes } from "@marwes-ui/core"
import { Skeleton } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"
import SkeletonShowcase from "./SkeletonShowcase.svelte"

const meta = {
  title: "Skeleton/Atom",
  component: Skeleton,
  parameters: {
    ...storybookLayout.padded,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
  argTypes: storybookSkeletonArgTypes,
  args: {
    variant: "text",
    animation: "pulse",
    decorative: true,
  },
} satisfies Meta<typeof Skeleton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Circular: Story = {
  args: { variant: "circular" },
}

export const Rectangular: Story = {
  args: { variant: "rectangular" },
}

export const Wave: Story = {
  args: { variant: "rectangular", width: 280, height: 120, animation: "wave" },
}

export const FigmaShapes: Story = {
  render: () => ({
    Component: SkeletonShowcase,
    props: { showcase: "figma-shapes" },
  }),
}

export const LoadingCard: Story = {
  render: () => ({
    Component: SkeletonShowcase,
    props: { showcase: "loading-card" },
  }),
}

export const AccessibleStatus: Story = {
  render: () => ({
    Component: SkeletonShowcase,
    props: { showcase: "accessible-status" },
  }),
}
