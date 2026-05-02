import { storybookLayout } from "@marwes-ui/core"
import { RadiusSlider } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"

const meta = {
  title: "Slider/Purpose/RadiusSlider",
  component: RadiusSlider,
  parameters: storybookLayout.padded,
  tags: ["autodocs"],
} satisfies Meta<typeof RadiusSlider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => {
    const [value, setValue] = React.useState(24)

    return (
      <RadiusSlider
        description="Control the corner rounding used across the component set."
        slider={{ value, onValueChange: setValue }}
      />
    )
  },
}
