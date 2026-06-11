import type {
  SegmentedControlA11yProps,
  SegmentedControlItemA11yProps,
  SegmentedControlItemOptions,
  SegmentedControlItemState,
  SegmentedControlOptions,
} from "./segmented-control-types"

export type SegmentedControlNavigationDirection = "next" | "previous" | "start" | "end"

export function resolveSegmentedControlA11y(
  opts: SegmentedControlOptions,
): SegmentedControlA11yProps {
  const a11y: SegmentedControlA11yProps = {
    role: "radiogroup",
  }

  const accessibleLabel = opts.ariaLabel ?? opts.label
  if (accessibleLabel) a11y.ariaLabel = accessibleLabel
  if (opts.disabled) a11y.ariaDisabled = true

  return a11y
}

export function resolveSegmentedControlItemA11y(
  opts: SegmentedControlItemOptions,
): SegmentedControlItemA11yProps {
  const a11y: SegmentedControlItemA11yProps = {
    role: "radio",
    ariaChecked: opts.selected ?? false,
    tabIndex: opts.selected && !opts.disabled ? 0 : -1,
  }

  if (opts.disabled) a11y.ariaDisabled = true
  const accessibleLabel = opts.ariaLabel ?? opts.label
  if (accessibleLabel) a11y.ariaLabel = accessibleLabel

  return a11y
}

export function resolveSegmentedControlValue(
  items: SegmentedControlItemState[],
  requestedValue?: string,
): string | undefined {
  if (items.length === 0) return undefined

  if (requestedValue) {
    const match = items.find((item) => item.value === requestedValue && !item.disabled)
    if (match) return match.value
  }

  return items.find((item) => !item.disabled)?.value
}

export function moveSegmentedControlSelection(
  items: SegmentedControlItemState[],
  currentValue: string | undefined,
  direction: SegmentedControlNavigationDirection,
): string | undefined {
  const enabled = items.filter((item) => !item.disabled)
  if (enabled.length === 0) return undefined

  if (direction === "start") return enabled[0]?.value
  if (direction === "end") return enabled[enabled.length - 1]?.value

  const currentIndex = enabled.findIndex((item) => item.value === currentValue)
  if (currentIndex === -1) return enabled[0]?.value

  const delta = direction === "next" ? 1 : -1
  const nextIndex = (currentIndex + delta + enabled.length) % enabled.length
  return enabled[nextIndex]?.value
}
