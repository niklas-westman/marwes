import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import type { BrightnessSliderProps } from "@marwes-ui/vue"
import { BrightnessSlider } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"
import { ref } from "vue"

const meta = {
  title: "Slider/Purpose/BrightnessSlider",
  component: BrightnessSlider as unknown as object,
  parameters: {
    ...storybookLayout.padded,

    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
} satisfies Meta<BrightnessSliderProps>

export default meta
type Story = StoryObj<BrightnessSliderProps>

export const Default: Story = {
  render: () => ({
    components: { BrightnessSlider },
    setup() {
      const value = ref(80)
      return { value }
    },
    template: `
      <BrightnessSlider
        description="Tune the display intensity for the current workspace."
        :slider="{ value, onValueChange: (nextValue) => (value = nextValue) }"
      />
    `,
  }),
}
