import type { CssVars } from "../../../shared/css-vars"
import { IconName, iconNamesList } from "./icon-names"
import type { IconName as IconNameType } from "./icon-names"

// Re-export from generated file
export { IconName, iconNamesList }
export type { IconNameType }

export type IconSize = "xs" | "sm" | "md" | "lg"
export type IconStrokeWidth = "xs" | "sm" | "md" | "lg"
export type IconColor = "currentColor" | "primary" | "secondary" | "muted"

/**
 * @deprecated Use `iconNamesList` instead
 */
export const iconNames = iconNamesList

export type IconOptions = {
  name: IconNameType
  size?: IconSize
  strokeWidth?: IconStrokeWidth
  color?: IconColor

  // Accessibility
  ariaLabel?: string
  ariaHidden?: boolean
  decorative?: boolean
}

export type IconA11yProps = {
  ariaLabel?: string
  ariaHidden?: boolean
  role?: "img"
}

/**
 * Valid SVG element types used in icon definitions.
 * This ensures type safety when rendering icon nodes.
 */
export type SvgElementType =
  | "path"
  | "circle"
  | "line"
  | "polygon"
  | "polyline"
  | "rect"
  | "ellipse"

export type SvgNode = {
  tag: SvgElementType
  attrs: Record<string, string>
}

export type IconRenderKit = {
  tag: "svg"
  className: string
  vars: CssVars
  a11y: IconA11yProps
  svg: {
    viewBox: string
    nodes: readonly SvgNode[]
    width: number
    height: number
    type: "stroke"
  }
}
