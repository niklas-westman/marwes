/**
 * Core types for Tab.
 * - Core never renders; it returns a render kit consumed by adapters (React/Vue).
 */

export interface TabOptions {
  /** aria-selected — active/inactive state */
  selected?: boolean
  disabled?: boolean
  /** For icon-only tabs that have no visible label */
  ariaLabel?: string
  label?: string
  /** id of the associated tabpanel this tab controls */
  ariaControls?: string
}

export interface TabA11yProps {
  role: "tab"
  ariaSelected: boolean
  ariaDisabled?: true
  tabIndex: 0 | -1
  ariaLabel?: string
  ariaControls?: string
}

export interface TabRenderKit {
  tag: "button"
  className: string
  vars: Record<string, string>
  a11y: TabA11yProps
}
