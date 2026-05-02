import { storybookLayout } from "@marwes-ui/core"
import { VolumeSlider } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"

const meta = {
  title: "Slider/Purpose/VolumeSlider",
  component: VolumeSlider,
  parameters: storybookLayout.padded,
  tags: ["autodocs"],
} satisfies Meta<typeof VolumeSlider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => {
    const [value, setValue] = React.useState(45)

    return (
      <VolumeSlider
        description="Adjust the current output level for media playback."
        slider={{ value, onValueChange: setValue }}
      />
    )
  },
}

export const Vertical: Story = {
  render: () => {
    const [value, setValue] = React.useState(45)

    return (
      <div style={{ height: 280, display: "flex", alignItems: "center" }}>
        <VolumeSlider
          orientation="vertical"
          description="Adjust the current output level for media playback."
          slider={{ value, onValueChange: setValue }}
        />
      </div>
    )
  },
}
