import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import type { SliderFieldProps } from "@marwes-ui/vue"
import { SliderField } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"
import { ref } from "vue"

const meta = {
  title: "Slider/Molecule",
  component: SliderField as unknown as object,
  parameters: {
    ...storybookLayout.padded,

    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
} satisfies Meta<SliderFieldProps>

export default meta
type Story = StoryObj<SliderFieldProps>

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
  render: () => ({
    components: { SliderField },
    setup() {
      const value = ref(24)
      return { value }
    },
    template: `
      <SliderField
        v-model="value"
        label="Radius"
        description="Controls the corner rounding used by the UI."
        :slider="{ min: 0, max: 48, step: 2, showTooltip: true }"
      />
    `,
  }),
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
