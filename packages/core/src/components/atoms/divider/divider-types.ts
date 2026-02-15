/**
 * Core types for Divider component.
 * - Core returns a render kit consumed by adapters (React/Vue).
 * - Supports 7 size variants: xxs/xs/sm/md/lg/xl/xxl (maps to 1px-80px).
 * - Supports horizontal and vertical orientation.
 * - Figma reference: node-id=1-932
 */

import type { CssVars } from "../../../shared/css-vars"

/** Size variants for divider thickness/height. */
export type DividerSize = "xxs" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl"

/** Orientation of the divider. */
export type DividerOrientation = "horizontal" | "vertical"

/** Public props the adapter can pass into core. */
export type DividerOptions = {
  /**
   * Size variant for the divider.
   * - xxs: 1px
   * - xs: 8px
   * - sm: 16px
   * - md: 32px (default)
   * - lg: 48px
   * - xl: 64px
   * - xxl: 80px
   */
  size?: DividerSize

  /**
   * Orientation of the divider.
   * Default: "horizontal"
   */
  orientation?: DividerOrientation

  /**
   * Optional ID.
   */
  id?: string
}

/** Strict a11y output for dividers. */
export type DividerA11y = {
  id?: string
  role: "separator"
  "aria-orientation": "horizontal" | "vertical"
}

/** Data attributes for divider. */
export type DividerDataAttributes = {
  "data-orientation": "horizontal" | "vertical"
  "data-size": DividerSize
}

/** Render kit output. */
export type DividerRenderKit = {
  /** Always <hr> tag for semantic separators. */
  tag: "hr"

  /** CSS class names. */
  className: string

  /** CSS variables for theming. */
  vars: CssVars

  /** Accessibility props. */
  a11y: DividerA11y

  /** Data attributes for styling hooks. */
  dataAttributes: DividerDataAttributes
}
