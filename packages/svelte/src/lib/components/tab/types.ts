import type { Snippet } from "svelte"

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
  class?: string
}
