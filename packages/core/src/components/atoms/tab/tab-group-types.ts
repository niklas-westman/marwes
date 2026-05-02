export interface TabGroupItemState {
  value: string
  disabled?: boolean
}

export interface TabGroupA11yIds {
  labelId?: string
  tabListId: string
  tabIds: Record<string, string>
  panelIds: Record<string, string>
}
