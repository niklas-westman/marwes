import type {
  TabGroupA11yIds,
  TabGroupItemState,
  TabListA11yProps,
  TabPanelA11yProps,
} from "./tab-group-types"

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

const DEFAULT_TABLIST_LABEL = "Tabs"

export function resolveTabListA11y(args: {
  tabListId: string
  /** Id of the visible label element, when the group renders one. */
  labelId?: string | undefined
  ariaLabel?: string | undefined
}): TabListA11yProps {
  const a11y: TabListA11yProps = { id: args.tabListId, role: "tablist" }

  // A visible label names the tablist; otherwise fall back to ariaLabel, then a generic name.
  if (args.labelId) a11y.ariaLabelledBy = args.labelId
  else a11y.ariaLabel = args.ariaLabel ?? DEFAULT_TABLIST_LABEL

  return a11y
}

export function resolveTabPanelA11y(args: {
  id: string
  tabId: string
  hidden?: boolean | undefined
}): TabPanelA11yProps {
  const a11y: TabPanelA11yProps = { id: args.id, role: "tabpanel", ariaLabelledBy: args.tabId }

  if (args.hidden) a11y.hidden = true
  else a11y.tabIndex = 0

  return a11y
}
