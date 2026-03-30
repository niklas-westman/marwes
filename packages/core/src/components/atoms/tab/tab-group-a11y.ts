import type { TabGroupA11yIds, TabGroupItemState } from "./tab-group-types"

export type TabNavigationDirection = "next" | "previous" | "start" | "end"

export function buildTabGroupA11yIds(args: {
  id: string
  itemValues: string[]
  hasLabel?: boolean
}): TabGroupA11yIds {
  const tabIds = Object.fromEntries(
    args.itemValues.map((value) => [value, `${args.id}-tab-${value}`]),
  )
  const panelIds = Object.fromEntries(
    args.itemValues.map((value) => [value, `${args.id}-panel-${value}`]),
  )

  const result: TabGroupA11yIds = {
    tabListId: `${args.id}-tablist`,
    tabIds,
    panelIds,
  }

  if (args.hasLabel) {
    result.labelId = `${args.id}-label`
  }

  return result
}

export function resolveTabValue(
  items: TabGroupItemState[],
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

export function moveTabSelection(
  items: TabGroupItemState[],
  currentValue: string | undefined,
  direction: TabNavigationDirection,
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
