import { storybookA11yPolicy, storybookLayout, storybookProgressBarArgTypes } from "@marwes-ui/core"
import type { ProgressBarProps } from "@marwes-ui/vue"
import { ProgressBar } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

const stackStyle = "display: grid; gap: 1.5rem; width: min(560px, 100%);"
const rowStyle =
  "display: grid; grid-template-columns: 8rem minmax(15rem, 1fr); gap: 1.5rem; align-items: center;"

const meta = {
  title: "ProgressBar/Atom",
  component: ProgressBar as unknown as object,
  parameters: {
    ...storybookLayout.padded,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
  argTypes: storybookProgressBarArgTypes,
  args: {
    label: "Progress",
    value: 60,
    min: 0,
    max: 100,
    size: "small",
    state: "default",
    showLabel: true,
    showPercentage: true,
  },
} satisfies Meta<ProgressBarProps>

export default meta
type Story = StoryObj<ProgressBarProps>

export const Default: Story = {}

export const LargeTrack: Story = {
  args: { size: "default" },
}

export const WithoutLabel: Story = {
  args: {
    showLabel: false,
    ariaLabel: "Progress",
  },
}

export const WithoutPercentage: Story = {
  args: { showPercentage: false },
}

export const StateGallery: Story = {
  render: () => ({
    components: { ProgressBar },
    setup() {
      return { stackStyle, rowStyle }
    },
    template: `
      <div :style="stackStyle">
        <div :style="rowStyle"><span>Default</span><ProgressBar label="Progress" :value="60" /></div>
        <div :style="rowStyle"><span>Hover</span><ProgressBar label="Progress" :value="60" state="hover" /></div>
        <div :style="rowStyle"><span>Pressed</span><ProgressBar label="Progress" :value="60" state="pressed" /></div>
        <div :style="rowStyle"><span>Disabled</span><ProgressBar label="Progress" :value="60" disabled /></div>
        <div :style="rowStyle"><span>Focus</span><ProgressBar label="Progress" :value="60" state="focus" /></div>
      </div>
    `,
  }),
}
