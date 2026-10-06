/**
 * Core types for Drawer.
 * Core owns the behavior contract; adapters own rendering and lifecycle.
 */

export type DrawerSize = "small" | "medium" | "large"
export type DrawerPlacement = "left" | "right"

export interface DrawerOptions {
  size?: DrawerSize
  placement?: DrawerPlacement
  showFooter?: boolean
  dismissible?: boolean
  /** Accessible name of the close button. Defaults to "Close drawer". */
  closeLabel?: string
  modal?: boolean
  showScrim?: boolean
  ariaLabel?: string
  ariaLabelledBy?: string
  ariaDescribedBy?: string
  dataAttributes?: Record<string, string | boolean | undefined>
}

export interface DrawerA11yProps {
  role: "dialog"
  ariaModal?: true
  ariaLabel?: string
  ariaLabelledBy?: string
  ariaDescribedBy?: string
}

export interface DrawerPanelRenderKit {
  tag: "div"
  className: string
  vars: Record<string, string>
  a11y: DrawerA11yProps
  dataAttributes: Record<string, string | boolean | undefined>
}

export interface DrawerScrimRenderKit {
  tag: "div"
  className: string
  vars: Record<string, string>
  dataAttributes: Record<string, string | boolean | undefined>
}

export interface DrawerRenderKit {
  tag: "div"
  className: string
  vars: Record<string, string>
  size: DrawerSize
  placement: DrawerPlacement
  showFooter: boolean
  showCloseButton: boolean
  showScrim: boolean
  closeButton: { a11y: DrawerCloseButtonA11yProps }
  panel: DrawerPanelRenderKit
  scrim: DrawerScrimRenderKit
  dataAttributes: Record<string, string | boolean | undefined>
}

/** ARIA fields for the close button. */
export interface DrawerCloseButtonA11yProps {
  ariaLabel: string
}
