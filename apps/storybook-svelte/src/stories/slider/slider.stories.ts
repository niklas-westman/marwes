import { storybookA11yPolicy, storybookLayout, storybookSliderArgTypes } from "@marwes-ui/core"
import { Slider } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"

const meta = {
  title: "Slider/Atom",
  component: Slider,
  parameters: {
    ...storybookLayout.padded,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
  argTypes: storybookSliderArgTypes,
  args: {
    value: 50,
    min: 0,
    max: 100,
  },
} satisfies Meta<typeof Slider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const WithStep: Story = { args: { value: 25, step: 25 } }
export const ShowTooltip: Story = { args: { value: 60, showTooltip: true } }
export const Disabled: Story = { args: { value: 30, disabled: true } }
