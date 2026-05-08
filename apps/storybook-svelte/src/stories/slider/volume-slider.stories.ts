import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { VolumeSlider } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"

const meta = {
  title: "Slider/Purpose/VolumeSlider",
  component: VolumeSlider,
  parameters: {
    ...storybookLayout.padded,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof VolumeSlider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { value: 45 },
}

export const Vertical: Story = {
  args: { value: 45, orientation: "vertical" },
}
