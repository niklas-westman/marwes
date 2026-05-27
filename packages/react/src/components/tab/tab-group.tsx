import {
  type TabGroupItemState,
  buildTabGroupA11yIds,
  moveTabSelection,
  resolveTabValue,
} from "@marwes-ui/core"
import * as React from "react"
import { Paragraph } from "../paragraph"
import { Text } from "../text"
import { Tab } from "./tab"

export interface TabGroupItem {
  value: string
  label: React.ReactNode
  panel: React.ReactNode
  disabled?: boolean
  ariaLabel?: string
}

export interface TabGroupProps {
  id?: string
  label?: React.ReactNode
  ariaLabel?: string
  tabs: TabGroupItem[]
  activeTab?: string
  defaultActiveTab?: string
  onActiveTabChange?: (value: string) => void
  className?: string
  dataAttributes?: Record<string, string>
}

export interface TabPanelProps {
  id: string
  tabId: string
  hidden?: boolean
  className?: string
  children?: React.ReactNode
}

function cx(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(" ")
}

function hasContent(value: React.ReactNode | undefined): boolean {
  if (value === undefined || value === null || value === false) {
    return false
  }

  if (typeof value === "string") {
    return value.trim().length > 0
  }

  return true
}

function focusTab(tabId: string): void {
  if (typeof document === "undefined") {
    return
  }

  const tab = document.getElementById(tabId)
  if (tab instanceof HTMLButtonElement) {
    tab.focus()
  }
}

function toItemState(tab: TabGroupItem): TabGroupItemState {
  const itemState: TabGroupItemState = { value: tab.value }

  if (tab.disabled) {
    itemState.disabled = true
  }

  return itemState
}

function renderPanelContent(children: React.ReactNode): React.ReactNode {
  if (typeof children === "string" || typeof children === "number") {
    return <Paragraph size="md">{children}</Paragraph>
  }

  return children
}

export function TabPanel(props: TabPanelProps): React.ReactElement {
  return (
    <div
      id={props.id}
      role="tabpanel"
      aria-labelledby={props.tabId}
      className={cx("mw-tab-group__panel", props.className)}
      hidden={props.hidden}
      tabIndex={props.hidden ? undefined : 0}
    >
      {renderPanelContent(props.children)}
    </div>
  )
}

export function TabGroup(props: TabGroupProps): React.ReactElement {
  const reactId = React.useId()
  const id = props.id ?? `mw-tab-group-${reactId}`
  const hasLabel = hasContent(props.label)
  const itemStates = React.useMemo<TabGroupItemState[]>(
    () => props.tabs.map((tab) => toItemState(tab)),
    [props.tabs],
  )
  const isControlled = props.activeTab !== undefined
  const [internalActiveTab, setInternalActiveTab] = React.useState<string | undefined>(() =>
    resolveTabValue(itemStates, props.defaultActiveTab),
  )

  const resolvedActiveTab = React.useMemo(
    () => resolveTabValue(itemStates, isControlled ? props.activeTab : internalActiveTab),
    [internalActiveTab, isControlled, itemStates, props.activeTab],
  )

  React.useEffect(() => {
    if (!isControlled) {
      setInternalActiveTab((currentValue) =>
        resolveTabValue(itemStates, currentValue ?? props.defaultActiveTab),
      )
    }
  }, [isControlled, itemStates, props.defaultActiveTab])

  const a11yIds = React.useMemo(
    () =>
      buildTabGroupA11yIds({
        id,
        itemValues: props.tabs.map((tab) => tab.value),
        hasLabel,
      }),
    [hasLabel, id, props.tabs],
  )

  const selectTab = React.useCallback(
    (nextValue: string | undefined) => {
      const resolvedValue = resolveTabValue(itemStates, nextValue)

      if (!resolvedValue) {
        return
      }

      if (!isControlled) {
        setInternalActiveTab(resolvedValue)
      }

      if (resolvedValue !== resolvedActiveTab) {
        props.onActiveTabChange?.(resolvedValue)
      }
    },
    [isControlled, itemStates, props.onActiveTabChange, resolvedActiveTab],
  )

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      let direction: "next" | "previous" | "start" | "end" | undefined

      switch (event.key) {
        case "ArrowRight":
          direction = "next"
          break
        case "ArrowLeft":
          direction = "previous"
          break
        case "Home":
          direction = "start"
          break
        case "End":
          direction = "end"
          break
        default:
          return
      }

      event.preventDefault()

      const nextValue = moveTabSelection(itemStates, resolvedActiveTab, direction)
      if (!nextValue) {
        return
      }

      selectTab(nextValue)
      const nextTabId = a11yIds.tabIds[nextValue]
      if (nextTabId) {
        focusTab(nextTabId)
      }
    },
    [a11yIds.tabIds, itemStates, resolvedActiveTab, selectTab],
  )

  return (
    <section className={cx("mw-tab-group", props.className)} {...props.dataAttributes}>
      {hasLabel && (
        <div className="mw-tab-group__header">
          <Text variant="label" id={a11yIds.labelId ?? `${id}-label`}>
            {props.label}
          </Text>
        </div>
      )}

      <div
        id={a11yIds.tabListId}
        className="mw-tab-group__list"
        role="tablist"
        aria-label={hasLabel ? undefined : (props.ariaLabel ?? "Tabs")}
        aria-labelledby={hasLabel ? a11yIds.labelId : undefined}
        onKeyDown={handleKeyDown}
      >
        {props.tabs.map((tab) => {
          const tabId = a11yIds.tabIds[tab.value] ?? `${id}-tab-${tab.value}`
          const panelId = a11yIds.panelIds[tab.value] ?? `${id}-panel-${tab.value}`
          const tabProps: React.ComponentProps<typeof Tab> = {
            id: tabId,
            selected: tab.value === resolvedActiveTab,
            ariaControls: panelId,
            onClick: () => selectTab(tab.value),
          }

          if (tab.disabled) {
            tabProps.disabled = true
          }

          if (tab.ariaLabel) {
            tabProps.ariaLabel = tab.ariaLabel
          }

          return (
            <Tab key={tab.value} {...tabProps}>
              {tab.label}
            </Tab>
          )
        })}
      </div>

      <div className="mw-tab-group__panels">
        {props.tabs.map((tab) => {
          const panelId = a11yIds.panelIds[tab.value] ?? `${id}-panel-${tab.value}`
          const tabId = a11yIds.tabIds[tab.value] ?? `${id}-tab-${tab.value}`

          return (
            <TabPanel
              key={tab.value}
              id={panelId}
              tabId={tabId}
              hidden={tab.value !== resolvedActiveTab}
            >
              {tab.panel}
            </TabPanel>
          )
        })}
      </div>
    </section>
  )
}
