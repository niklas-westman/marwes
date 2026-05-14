import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { SliderField } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"

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

export const Default: Story = {
  args: {
    label: "Volume",
    slider: { min: 0, max: 100 },
    value: 50,
  },
}

export const WithHelperText: Story = {
  args: {
    label: "Radius",
    description: "Controls the corner rounding used by the UI.",
    slider: { min: 0, max: 48, step: 2 },
    value: 24,
  },
}

export const WithError: Story = {
  args: {
    label: "Temperature",
    error: "Select a value within the allowed range.",
    slider: { min: 0, max: 100 },
    value: 50,
  },
}

export const Disabled: Story = {
  args: {
    label: "Radius",
    description: "This value is managed by your theme preset.",
    slider: { min: 0, max: 48, disabled: true },
    value: 24,
  },
}

export const Controlled: Story = {
  args: {
    label: "Brightness",
    slider: { min: 0, max: 100 },
    value: 75,
  },
}

export const InlineLabels: Story = {
  args: {
    label: "Font size",
    slider: { min: 12, max: 32, step: 1 },
    value: 16,
    labelPosition: "inline",
  },
}

export const Playground: Story = {
  args: {
    label: "Playground slider",
    slider: { min: 0, max: 100, step: 5 },
    value: 50,
  },
}
