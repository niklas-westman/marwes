import { storybookLayout } from "@marwes-ui/core"
import type { RadiusSliderProps } from "@marwes-ui/vue"
import { RadiusSlider } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"
import { ref } from "vue"

const meta = {
  title: "Slider/Purpose/RadiusSlider",
  component: RadiusSlider as unknown as object,
  parameters: storybookLayout.padded,
  tags: ["autodocs"],
} satisfies Meta<RadiusSliderProps>

export default meta
type Story = StoryObj<RadiusSliderProps>

export const Default: Story = {
  render: () => ({
    components: { RadiusSlider },
    setup() {
      const value = ref(24)
      return { value }
    },
    template: `
      <RadiusSlider
        description="Control the corner rounding used across the component set."
        :slider="{ value, onValueChange: (nextValue) => (value = nextValue) }"
      />
    `,
  }),
}
