import type { CssVars } from "../../../shared/css-vars"

export type DividerSize = "xxs" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl"

export type DividerOrientation = "horizontal" | "vertical"

export interface DividerOptions {
  /**
   * Spacing mode from the Figma divider set.
   * Each mode keeps a 1px line and changes the total occupied spacing.
   */
  size?: DividerSize

  /**
   * Separator direction.
   * Figma only shows horizontal dividers, but adapters also support vertical separators.
   */
  orientation?: DividerOrientation

  id?: string
}

export interface DividerA11y {
  id?: string
  role: "separator"
  "aria-orientation": DividerOrientation
}

export interface DividerDataAttributes {
  "data-component": "divider"
  "data-orientation": DividerOrientation
  "data-size": DividerSize
}

export interface DividerRenderKit {
  tag: "hr"
  className: string
  vars: CssVars
  a11y: DividerA11y
  dataAttributes: DividerDataAttributes
}
