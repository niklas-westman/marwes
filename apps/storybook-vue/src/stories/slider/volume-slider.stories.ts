import { storybookLayout } from "@marwes-ui/core"
import type { VolumeSliderProps } from "@marwes-ui/vue"
import { VolumeSlider } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"
import { ref } from "vue"

const meta = {
  title: "Slider/Purpose/VolumeSlider",
  component: VolumeSlider as unknown as object,
  parameters: storybookLayout.padded,
  tags: ["autodocs"],
} satisfies Meta<VolumeSliderProps>

export default meta
type Story = StoryObj<VolumeSliderProps>

export const Default: Story = {
  render: () => ({
    components: { VolumeSlider },
    setup() {
      const value = ref(45)
      return { value }
    },
    template: `
      <VolumeSlider
        description="Adjust the current output level for media playback."
        :slider="{ value, onValueChange: (nextValue) => (value = nextValue) }"
      />
    `,
  }),
}
