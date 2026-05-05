import type { CssVars } from "../../../shared/css-vars"

export const SkeletonVariant = {
  text: "text",
  circular: "circular",
  rectangular: "rectangular",
} as const
export type SkeletonVariant = (typeof SkeletonVariant)[keyof typeof SkeletonVariant]

export const skeletonVariants = Object.values(SkeletonVariant) as SkeletonVariant[]

export const SkeletonAnimation = {
  pulse: "pulse",
  wave: "wave",
  none: "none",
} as const
export type SkeletonAnimation = (typeof SkeletonAnimation)[keyof typeof SkeletonAnimation]

export const skeletonAnimations = Object.values(SkeletonAnimation) as SkeletonAnimation[]

export type SkeletonDimension = number | string

export interface SkeletonOptions {
  /** Visual shape from the synced Skeleton page. */
  variant?: SkeletonVariant

  /** Width of the placeholder. Numbers are interpreted as pixels. */
  width?: SkeletonDimension

  /** Height of the placeholder. Numbers are interpreted as pixels. */
  height?: SkeletonDimension

  /** Corner radius override. Numbers are interpreted as pixels. Circular skeletons force a full radius. */
  radius?: SkeletonDimension

  /** Visual animation. Defaults to `pulse`; use `none` for static placeholders. */
  animation?: SkeletonAnimation

  /** Hide the placeholder from assistive technology. Defaults to true unless `ariaLabel` is provided. */
  decorative?: boolean

  /** Accessible label for standalone loading placeholder groups. */
  ariaLabel?: string

  id?: string
}

export interface SkeletonA11yProps {
  id?: string
  role?: "status"
  ariaHidden?: true
  ariaLabel?: string
  ariaLive?: "polite"
}

export interface SkeletonDataAttributes {
  "data-component": "skeleton"
  "data-variant": SkeletonVariant
  "data-animation": SkeletonAnimation
}

export interface SkeletonRenderKit {
  tag: "span"
  className: string
  vars: CssVars
  a11y: SkeletonA11yProps
  dataAttributes: SkeletonDataAttributes
}
