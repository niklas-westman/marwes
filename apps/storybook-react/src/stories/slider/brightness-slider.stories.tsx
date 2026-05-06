import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { BrightnessSlider } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"

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
  render: () => {
    const [value, setValue] = React.useState(80)

    return (
      <BrightnessSlider
        description="Tune the display intensity for the current workspace."
        slider={{ value, onValueChange: setValue }}
      />
    )
  },
}
