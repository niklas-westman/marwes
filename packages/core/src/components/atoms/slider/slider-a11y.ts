import type { SliderA11yProps, SliderOptions } from "./slider-types"

const DEFAULT_SLIDER_MIN = 0
const DEFAULT_SLIDER_MAX = 100
const DEFAULT_SLIDER_STEP = 1

function resolveSliderMin(value: number | undefined): number {
  if (value === undefined || !Number.isFinite(value)) {
    return DEFAULT_SLIDER_MIN
  }

  return value
}

function resolveSliderMax(value: number | undefined, min: number): number {
  if (value === undefined || !Number.isFinite(value)) {
    return DEFAULT_SLIDER_MAX >= min ? DEFAULT_SLIDER_MAX : min
  }

  return value >= min ? value : min
}

function resolveSliderStep(value: number | undefined): number {
  if (value === undefined || !Number.isFinite(value) || value <= 0) {
    return DEFAULT_SLIDER_STEP
  }

  return value
}

export function resolveSliderA11y(opts: SliderOptions): SliderA11yProps {
  const min = resolveSliderMin(opts.min)
  const max = resolveSliderMax(opts.max, min)
  const step = resolveSliderStep(opts.step)

  const a11y: SliderA11yProps = {
    type: "range",
    min,
    max,
    step,
  }

  if (opts.id) a11y.id = opts.id
  if (opts.name) a11y.name = opts.name
  if (opts.disabled) a11y.disabled = true
  if (opts.required) a11y.required = true
  if (opts.ariaLabel) a11y.ariaLabel = opts.ariaLabel
  if (opts.ariaLabelledBy) a11y.ariaLabelledBy = opts.ariaLabelledBy
  if (opts.ariaDescribedBy) a11y.ariaDescribedBy = opts.ariaDescribedBy
  if (opts.ariaValueText) a11y.ariaValueText = opts.ariaValueText
  if (opts.orientation === "vertical") a11y.ariaOrientation = "vertical"

  return a11y
}
