import type { TabOptions } from "@marwes-ui/core"
import type { Snippet } from "svelte"

export interface TabProps extends TabOptions {
  children?: Snippet
  class?: string
  id?: string
  onclick?: (e: MouseEvent) => void
}

export interface TabPanelProps {
  id: string
  tabId: string
  hidden?: boolean
  children?: Snippet
  class?: string
}

export interface TabGroupItem {
  value: string
  label: string
  panel: Snippet | string
  disabled?: boolean
  ariaLabel?: string
}

export interface TabGroupProps {
  id?: string
  label?: string
  ariaLabel?: string
  tabs: TabGroupItem[]
  activeTab?: string
  defaultActiveTab?: string
  onactivetabchange?: (value: string) => void
  dataAttributes?: Record<string, string>
  class?: string
}

export type NavigationTabsProps = TabGroupProps
export type ContentTabsProps = TabGroupProps
export type SettingsTabsProps = TabGroupProps
