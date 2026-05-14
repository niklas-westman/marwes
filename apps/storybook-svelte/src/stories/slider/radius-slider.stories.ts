import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { RadiusSlider } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"

const meta = {
  title: "Slider/Purpose/RadiusSlider",
  component: RadiusSlider,
  parameters: {
    ...storybookLayout.padded,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof RadiusSlider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { value: 16 },
}
