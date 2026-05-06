import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { SliderField } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"

const meta = {
  title: "Slider/Molecule",
  component: SliderField,
  parameters: {
    ...storybookLayout.padded,

    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof SliderField>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  args: {
    label: "Volume",
    description: "Adjust the output level.",
    slider: {
      min: 0,
      max: 100,
      defaultValue: 50,
    },
  },
}

export const Controlled: Story = {
  args: {
    label: "Radius",
    slider: {
      min: 0,
      max: 48,
      step: 2,
      defaultValue: 24,
    },
  },
  render: () => {
    const [value, setValue] = React.useState(24)

    return (
      <SliderField
        label="Radius"
        description="Controls the corner rounding used by the UI."
        slider={{ min: 0, max: 48, step: 2, value, onValueChange: setValue, showTooltip: true }}
      />
    )
  },
}

export const InlineLabels: Story = {
  args: {
    label: "Volume",
    labelPosition: "inline",
    slider: {
      min: 0,
      max: 100,
      defaultValue: 50,
    },
  },
}

export const WithError: Story = {
  args: {
    label: "Temperature",
    error: "Select a value within the allowed range.",
    minValueLabel: "Cold",
    maxValueLabel: "Hot",
    slider: {
      min: 0,
      max: 100,
      defaultValue: 50,
      showTouchArea: true,
    },
  },
}

export const Disabled: Story = {
  args: {
    label: "Radius",
    description: "This value is managed by your theme preset.",
    slider: {
      min: 0,
      max: 48,
      defaultValue: 24,
      disabled: true,
    },
  },
}
