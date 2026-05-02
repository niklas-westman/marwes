import { storybookLayout, storybookSliderArgTypes } from "@marwes-ui/core"
import type { SliderProps } from "@marwes-ui/react"
import { Slider } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"

const stageStyle: React.CSSProperties = {
  width: "fit-content",
  padding: "1.25rem 1.5rem",
  borderRadius: "16px",
  background: "rgba(148, 163, 184, 0.08)",
  boxShadow: "inset 0 0 0 1px rgba(148, 163, 184, 0.22)",
}

const fullWidthStageStyle: React.CSSProperties = {
  ...stageStyle,
  width: "100%",
  maxWidth: "560px",
}

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

function SliderPreview(args: SliderProps): React.ReactElement {
  const [currentValue, setCurrentValue] = React.useState(() => resolveInitialValue(args))

  return (
    <div style={stageStyle}>
      <Slider
        {...args}
        value={currentValue}
        onValueChange={setCurrentValue}
        ariaValueText={args.ariaValueText ?? `${currentValue}`}
      />
    </div>
  )
}

const meta = {
  title: "Slider/Atom",
  component: Slider,
  parameters: storybookLayout.padded,
  tags: ["autodocs"],
  argTypes: storybookSliderArgTypes,
  args: {
    min: 0,
    max: 100,
    step: 1,
    defaultValue: 50,
    ariaLabel: "Volume",
  },
  render: (args) => {
    const previewKey = `${args.min}-${args.max}-${args.step}-${args.value}-${args.defaultValue}-${args.showTooltip}-${args.showTouchArea}`

    return <SliderPreview key={previewKey} {...args} />
  },
} satisfies Meta<typeof Slider>

export default meta
type Story = StoryObj<typeof meta>

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
  render: (args) => {
    const previewKey = `${args.min}-${args.max}-${args.step}-${args.value}-${args.defaultValue}`

    function FullWidthPreview(previewArgs: SliderProps): React.ReactElement {
      const [currentValue, setCurrentValue] = React.useState(() => resolveInitialValue(previewArgs))

      return (
        <div style={fullWidthStageStyle}>
          <Slider
            {...previewArgs}
            style={{ width: "100%" }}
            value={currentValue}
            onValueChange={setCurrentValue}
            ariaValueText={previewArgs.ariaValueText ?? `${currentValue}`}
          />
        </div>
      )
    }

    return <FullWidthPreview key={previewKey} {...args} />
  },
  args: {
    min: 0,
    max: 48,
    step: 2,
    defaultValue: 24,
    ariaLabel: "Radius",
  },
}
