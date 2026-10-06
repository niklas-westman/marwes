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

/** ARIA fields for the tablist element that holds the tabs. */
export interface TabListA11yProps {
  id: string
  role: "tablist"
  ariaLabel?: string
  ariaLabelledBy?: string
}

/** ARIA fields for one tabpanel. Only the active panel is visible and focusable. */
export interface TabPanelA11yProps {
  id: string
  role: "tabpanel"
  ariaLabelledBy: string
  tabIndex?: 0
  hidden?: true
}
