import type { CssVars } from "../../../shared/css-vars"

export interface TooltipOptions {
  id?: string
}

export interface TooltipA11yProps {
  id?: string
  role: "tooltip"
}

export interface TooltipDataAttributes {
  "data-component": "tooltip"
}

export interface TooltipRenderKit {
  tag: "span"
  className: string
  vars: CssVars
  a11y: TooltipA11yProps
  dataAttributes: TooltipDataAttributes
}

/** ARIA fields for the trigger button of a tooltip group. */
export interface TooltipTriggerA11yProps {
  ariaLabel: string
  /** Set to the tooltip id only while the tooltip is open. */
  ariaDescribedBy?: string
}

/** Extra ARIA fields a tooltip group adds to the tooltip while it plays its exit animation. */
export interface TooltipGroupContentA11yProps {
  ariaHidden?: true
}
