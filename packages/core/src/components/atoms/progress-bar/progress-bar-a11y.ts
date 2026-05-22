import type { ProgressBarA11yProps, ProgressBarOptions } from "./progress-bar-types"

export const DEFAULT_PROGRESS_BAR_MIN = 0
export const DEFAULT_PROGRESS_BAR_MAX = 100
export const DEFAULT_PROGRESS_BAR_LABEL = "Progress"

function resolveFiniteNumber(value: number | undefined, fallback: number): number {
  return value === undefined || !Number.isFinite(value) ? fallback : value
}

export function resolveProgressBarBounds(options: ProgressBarOptions): {
  min: number
  max: number
} {
  const min = resolveFiniteNumber(options.min, DEFAULT_PROGRESS_BAR_MIN)
  const rawMax = resolveFiniteNumber(options.max, DEFAULT_PROGRESS_BAR_MAX)
  const max = rawMax > min ? rawMax : min + 1

  return { min, max }
}

export function clampProgressBarValue(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min
  return Math.min(max, Math.max(min, value))
}

export function resolveProgressBarA11y(
  options: ProgressBarOptions,
  value: number,
): ProgressBarA11yProps {
  const { min, max } = resolveProgressBarBounds(options)
  const label = options.label ?? DEFAULT_PROGRESS_BAR_LABEL
  const labelId = options.id && options.showLabel !== false ? `${options.id}-label` : undefined
  const ariaLabelledBy = options.ariaLabelledBy ?? labelId
  const ariaLabel = ariaLabelledBy ? undefined : (options.ariaLabel ?? label)

  return {
    ...(options.id ? { id: options.id } : {}),
    role: "progressbar",
    ariaValueMin: min,
    ariaValueMax: max,
    ariaValueNow: value,
    ...(options.valueLabel ? { ariaValueText: options.valueLabel } : {}),
    ...(ariaLabel ? { ariaLabel } : {}),
    ...(ariaLabelledBy ? { ariaLabelledBy } : {}),
    ...(options.ariaDescribedBy ? { ariaDescribedBy: options.ariaDescribedBy } : {}),
    ...(options.disabled ? { ariaDisabled: true } : {}),
  }
}
