import {
  DEFAULT_PROGRESS_BAR_LABEL,
  clampProgressBarValue,
  resolveProgressBarA11y,
  resolveProgressBarBounds,
} from "./progress-bar-a11y"
import { ProgressBarSize, ProgressBarState } from "./progress-bar-types"
import type { ProgressBarOptions, ProgressBarRenderKit } from "./progress-bar-types"

function cx(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(" ")
}

function resolveProgressBarPercentage(value: number, min: number, max: number): number {
  const range = max - min
  if (range <= 0) return 0
  return ((value - min) / range) * 100
}

function resolvePercentageLabel(percentage: number, valueLabel: string | undefined): string {
  if (valueLabel) return valueLabel
  return `${Math.round(percentage)}%`
}

export function createProgressBarRecipe(options: ProgressBarOptions = {}): ProgressBarRenderKit {
  const { min, max } = resolveProgressBarBounds(options)
  const value = clampProgressBarValue(options.value ?? min, min, max)
  const percentage = resolveProgressBarPercentage(value, min, max)
  const size = options.size ?? ProgressBarSize.default
  const state = options.state ?? ProgressBarState.default
  const showLabel = options.showLabel !== false
  const showPercentage = options.showPercentage !== false
  const label = options.label ?? DEFAULT_PROGRESS_BAR_LABEL
  const percentageLabel = resolvePercentageLabel(percentage, options.valueLabel)
  const a11y = resolveProgressBarA11y({ ...options, showLabel }, value)

  return {
    tag: "div",
    className: cx(
      "mw-progress-bar",
      `mw-progress-bar--${size}`,
      state !== ProgressBarState.default && `mw-progress-bar--state-${state}`,
      options.disabled && "mw-progress-bar--disabled",
    ),
    trackClassName: "mw-progress-bar__track",
    fillClassName: "mw-progress-bar__fill",
    labelClassName: "mw-progress-bar__label",
    percentageClassName: "mw-progress-bar__percentage",
    ...(a11y.ariaLabelledBy && options.id ? { labelId: `${options.id}-label` } : {}),
    vars: {
      "--mw-progress-bar-value-percentage": `${percentage}%`,
    },
    a11y,
    dataAttributes: {
      "data-component": "progress-bar",
      "data-size": size,
      "data-state": state,
      ...(options.disabled ? { "data-disabled": "true" } : {}),
    },
    label,
    percentageLabel,
    value,
    min,
    max,
    percentage,
    size,
    state,
    showLabel,
    showPercentage,
  }
}
