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
