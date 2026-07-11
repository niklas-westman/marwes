import { storybookA11yPolicy, storybookLayout, storybookProgressBarArgTypes } from "@marwes-ui/core"
import { ProgressBar } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"
import ProgressBarShowcase from "./ProgressBarShowcase.svelte"

const meta = {
  title: "ProgressBar/Atom",
  component: ProgressBar,
  parameters: {
    ...storybookLayout.padded,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
  argTypes: storybookProgressBarArgTypes,
  args: {
    label: "Progress",
    value: 60,
    min: 0,
    max: 100,
    size: "small",
    state: "default",
    showLabel: true,
    showPercentage: true,
  },
} satisfies Meta<typeof ProgressBar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const LargeTrack: Story = {
  args: { size: "default" },
}

export const WithoutLabel: Story = {
  render: () => ({
    Component: ProgressBarShowcase,
    props: { showcase: "hidden-label" },
  }),
}

export const WithoutPercentage: Story = {
  args: { showPercentage: false },
}

export const StateGallery: Story = {
  render: () => ({
    Component: ProgressBarShowcase,
    props: { showcase: "states" },
  }),
}
