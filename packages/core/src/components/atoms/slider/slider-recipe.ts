import { resolveSliderA11y } from "./slider-a11y"
import type { SliderOptions, SliderRenderKit } from "./slider-types"

function clampSliderValue(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function resolveSliderCurrentValue(opts: SliderOptions, min: number, max: number): number {
  const fallbackValue = min + (max - min) / 2
  const candidateValue = opts.value ?? opts.defaultValue ?? fallbackValue

  if (!Number.isFinite(candidateValue)) {
    return fallbackValue
  }

  return clampSliderValue(candidateValue, min, max)
}

function resolveSliderFillPercentage(currentValue: number, min: number, max: number): number {
  const range = max - min

  if (range <= 0) {
    return 0
  }

  return ((currentValue - min) / range) * 100
}

function cx(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(" ")
}

export function createSliderRecipe(opts: SliderOptions = {}): SliderRenderKit {
  const a11y = resolveSliderA11y(opts)
  const currentValue = resolveSliderCurrentValue(opts, a11y.min, a11y.max)
  const fillPercentage = resolveSliderFillPercentage(currentValue, a11y.min, a11y.max)
  const showTooltip = opts.showTooltip === true
  const showTouchArea = opts.showTouchArea === true
  const orientation = opts.orientation ?? "horizontal"

  return {
    tag: "div",
    className: cx(
      "mw-slider",
      `mw-slider--${orientation}`,
      opts.disabled && "mw-slider--disabled",
      showTooltip && "mw-slider--with-tooltip",
      showTouchArea && "mw-slider--with-touch-area",
    ),
    inputClassName: "mw-slider__native",
    vars: {
      "--mw-slider-fill-percentage": `${fillPercentage}%`,
    },
    a11y,
    dataAttributes: {
      "data-component": "slider",
      "data-orientation": orientation,
      ...(showTooltip ? { "data-show-tooltip": "true" } : {}),
      ...(showTouchArea ? { "data-show-touch-area": "true" } : {}),
    },
    value: currentValue,
    showTooltip,
    showTouchArea,
    orientation,
  }
}
