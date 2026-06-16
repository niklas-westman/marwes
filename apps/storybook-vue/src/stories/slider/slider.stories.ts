import { storybookA11yPolicy, storybookLayout, storybookSliderArgTypes } from "@marwes-ui/core"
import type { Meta, StoryObj } from "@storybook/vue3-vite"
import { ref } from "vue"
// Atom is no longer publicly exported; deep-import for story documentation.
import { Slider, type SliderProps } from "../../../../../packages/vue/src/components/slider/slider"

const stageStyle = `
  width: fit-content;
  padding: 1.25rem 1.5rem;
  border-radius: 16px;
  background: rgba(148, 163, 184, 0.08);
  box-shadow: inset 0 0 0 1px rgba(148, 163, 184, 0.22);
`

const fullWidthStageStyle = `
  width: 100%;
  max-width: 560px;
  padding: 1.25rem 1.5rem;
  border-radius: 16px;
  background: rgba(148, 163, 184, 0.08);
  box-shadow: inset 0 0 0 1px rgba(148, 163, 184, 0.22);
`

function resolveInitialValue(args: SliderProps): number {
  if (typeof args.value === "number") {
    return args.value
  }

  if (typeof args.defaultValue === "number") {
    return args.defaultValue
  }

  const min = typeof args.min === "number" ? args.min : 0
  const max = typeof args.max === "number" ? args.max : 100

  return min + (max - min) / 2
}

function renderSliderPreview(args: SliderProps) {
  return {
    components: { Slider },
    setup() {
      const currentValue = ref(resolveInitialValue(args))

      return {
        args,
        currentValue,
        stageStyle,
      }
    },
    template: `
      <div :style="stageStyle">
        <Slider
          v-bind="args"
          :model-value="currentValue"
          :aria-value-text="args.ariaValueText ?? String(currentValue)"
          @update:model-value="currentValue = $event"
        />
      </div>
    `,
  }
}

const meta = {
  title: "Slider/Atom",
  component: Slider as unknown as object,
  parameters: {
    ...storybookLayout.padded,

    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
  argTypes: storybookSliderArgTypes,
  args: {
    min: 0,
    max: 100,
    step: 1,
    defaultValue: 50,
    ariaLabel: "Volume",
  },
  render: (args: SliderProps) => renderSliderPreview(args),
} satisfies Meta<SliderProps>

export default meta
type Story = StoryObj<SliderProps>

export const Default: Story = {}

export const Hover: Story = {
  args: {
    className: "mw-slider--state-hover",
  },
}

export const Pressed: Story = {
  args: {
    className: "mw-slider--state-pressed",
  },
}

export const Focus: Story = {
  args: {
    className: "mw-slider--state-focus",
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
}

export const WithTooltip: Story = {
  args: {
    showTooltip: true,
  },
}

export const WithTouchArea: Story = {
  args: {
    showTouchArea: true,
  },
}

export const FullWidth: Story = {
  render: (args: SliderProps) => ({
    components: { Slider },
    setup() {
      const currentValue = ref(resolveInitialValue(args))

      return {
        args,
        currentValue,
        fullWidthStageStyle,
      }
    },
    template: `
      <div :style="fullWidthStageStyle">
        <Slider
          v-bind="args"
          style="width: 100%;"
          :model-value="currentValue"
          :aria-value-text="args.ariaValueText ?? String(currentValue)"
          @update:model-value="currentValue = $event"
        />
      </div>
    `,
  }),
  args: {
    min: 0,
    max: 48,
    step: 2,
    defaultValue: 24,
    ariaLabel: "Radius",
  },
}
