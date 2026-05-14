import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { BrightnessSlider } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"

const meta = {
  title: "Slider/Purpose/BrightnessSlider",
  component: BrightnessSlider,
  parameters: {
    ...storybookLayout.padded,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof BrightnessSlider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    value: 80,
    description: "Tune the display intensity for the current workspace.",
  },
}
