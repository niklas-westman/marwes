import type { CssVars } from "../../../shared/css-vars"

export const SpinnerVariants = {
  classic: "classic",
  ring: "ring",
  dual: "dual",
  dotsRound: "dots-round",
  dotsSquare: "dots-square",
  lines: "lines",
  cross: "cross",
} as const

export const SpinnerVariant = SpinnerVariants
export type SpinnerVariant = (typeof SpinnerVariants)[keyof typeof SpinnerVariants]

export const spinnerVariants = Object.values(SpinnerVariants) as SpinnerVariant[]

export const spinnerSizeScale = {
  xs: 16,
  sm: 24,
  md: 32,
  lg: 40,
} as const
export type SpinnerSize = keyof typeof spinnerSizeScale

export const spinnerSizes = Object.keys(spinnerSizeScale) as SpinnerSize[]

export function resolveSpinnerSize(size: SpinnerSize | number): number {
  if (typeof size === "number") {
    return size
  }

  return spinnerSizeScale[size]
}

export interface SpinnerOptions {
  /**
   * Visual style from the synced Spinner showcase.
   * Defaults to `classic`, which is also the loading-button treatment in Figma.
   */
  variant?: SpinnerVariant

  /**
   * Token size (`xs`/`sm`/`md`/`lg`) or a custom pixel size.
   * Token mapping: xs=16, sm=24, md=32, lg=40.
   */
  size?: SpinnerSize | number

  /**
   * Hide the spinner from assistive technology when nearby text already explains loading.
   * Defaults to `true` unless an explicit `ariaLabel` is provided.
   */
  decorative?: boolean

  /**
   * Accessible name when the spinner should announce loading state on its own.
   */
  ariaLabel?: string

  id?: string
}

export interface SpinnerA11yProps {
  id?: string
  role?: "status"
  ariaHidden?: true
  ariaLabel?: string
  ariaLive?: "polite"
}

export interface SpinnerDataAttributes {
  "data-component": "spinner"
  "data-variant": SpinnerVariant
  "data-size": SpinnerSize | "custom"
}

export type SpinnerSvgElement = "circle" | "path" | "rect"

export interface SpinnerSvgNode {
  tag: SpinnerSvgElement
  attrs: Record<string, string>
}

export interface SpinnerSvgDefinition {
  viewBox: "0 0 24 24"
  nodes: readonly SpinnerSvgNode[]
}

export interface SpinnerRenderKit {
  tag: "span"
  className: string
  vars: CssVars
  a11y: SpinnerA11yProps
  dataAttributes: SpinnerDataAttributes
  svg: SpinnerSvgDefinition
}
