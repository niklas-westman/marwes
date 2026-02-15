import type { CssVars } from "../../../shared/css-vars"
import { iconRegistry } from "./icon-registry"

export type IconSize = "xs" | "sm" | "md" | "lg"
export type IconStrokeWidth = "xs" | "sm" | "md" | "lg"
export type IconColor = "currentColor" | "primary" | "secondary" | "muted"

export type IconName = keyof typeof iconRegistry

// Runtime list (useful for docs, search, etc.)
export const iconNames = Object.keys(iconRegistry) as IconName[]

export type IconOptions = {
  name: IconName
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
export type SvgElementType = "path" | "circle" | "line" | "polygon" | "polyline" | "rect" | "ellipse"

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
