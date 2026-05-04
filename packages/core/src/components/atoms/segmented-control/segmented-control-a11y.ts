import type {
  SegmentedControlA11yIds,
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

  if (opts.ariaLabel) a11y.ariaLabel = opts.ariaLabel
  if (opts.ariaLabelledby) a11y.ariaLabelledby = opts.ariaLabelledby
  if (opts.ariaDescribedBy) a11y.ariaDescribedBy = opts.ariaDescribedBy
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
  if (opts.ariaLabel) a11y.ariaLabel = opts.ariaLabel

  return a11y
}

export function buildSegmentedControlA11yIds(args: {
  id: string
  itemValues: string[]
  hasLabel?: boolean
}): SegmentedControlA11yIds {
  const itemIds = Object.fromEntries(
    args.itemValues.map((value) => [value, `${args.id}-item-${value}`]),
  )

  const result: SegmentedControlA11yIds = {
    groupId: `${args.id}-group`,
    itemIds,
  }

  if (args.hasLabel) {
    result.labelId = `${args.id}-label`
  }

  return result
}

export function resolveSegmentedControlValue(
  items: SegmentedControlItemState[],
  requestedValue?: string,
): string | undefined {
  if (items.length === 0) {
    return undefined
  }

  if (requestedValue) {
    const requestedItem = items.find((item) => item.value === requestedValue && !item.disabled)
    if (requestedItem) {
      return requestedItem.value
    }
  }

  return items.find((item) => !item.disabled)?.value
}

export function moveSegmentedControlSelection(
  items: SegmentedControlItemState[],
  currentValue: string | undefined,
  direction: SegmentedControlNavigationDirection,
): string | undefined {
  const enabledItems = items.filter((item) => !item.disabled)

  if (enabledItems.length === 0) {
    return undefined
  }

  if (direction === "start") {
    return enabledItems[0]?.value
  }

  if (direction === "end") {
    return enabledItems[enabledItems.length - 1]?.value
  }

  const currentIndex = enabledItems.findIndex((item) => item.value === currentValue)

  if (currentIndex === -1) {
    return enabledItems[0]?.value
  }

  const delta = direction === "next" ? 1 : -1
  const nextIndex = (currentIndex + delta + enabledItems.length) % enabledItems.length
  return enabledItems[nextIndex]?.value
}
