/**
 * Core types for Spacing component.
 * - Pure layout primitive that inserts vertical space between elements.
 * - 19 sizes mapped to the --mw-spacing-* token scale.
 * - Renders as an aria-hidden div.
 */

import type { CssVars } from "../../../shared/css-vars"

/**
 * Spacing token accessor and type — same import, two uses.
 *
 * Preferred value access:
 * ```ts
 * Spacings.sp24    // "sp-24"
 * ```
 *
 * Legacy key access also works:
 * ```ts
 * Spacings["sp-24"] // "sp-24"
 * ```
 *
 * Type use:
 * ```ts
 * size?: Spacings
 * ```
 *
 * Pixel scale:
 * sp-0→0 | sp-2→2 | sp-4→4 | sp-8→8 | sp-12→12 | sp-16→16
 * sp-24→24 | sp-32→32 | sp-40→40 | sp-48→48 | sp-56→56
 * sp-64→64 | sp-72→72 | sp-80→80 | sp-88→88 | sp-96→96
 * sp-104→104 | sp-112→112 | sp-120→120
 */
export const Spacings = {
  sp0: "sp-0",
  sp2: "sp-2",
  sp4: "sp-4",
  sp8: "sp-8",
  sp12: "sp-12",
  sp16: "sp-16",
  sp24: "sp-24",
  sp32: "sp-32",
  sp40: "sp-40",
  sp48: "sp-48",
  sp56: "sp-56",
  sp64: "sp-64",
  sp72: "sp-72",
  sp80: "sp-80",
  sp88: "sp-88",
  sp96: "sp-96",
  sp104: "sp-104",
  sp112: "sp-112",
  sp120: "sp-120",
  "sp-0": "sp-0",
  "sp-2": "sp-2",
  "sp-4": "sp-4",
  "sp-8": "sp-8",
  "sp-12": "sp-12",
  "sp-16": "sp-16",
  "sp-24": "sp-24",
  "sp-32": "sp-32",
  "sp-40": "sp-40",
  "sp-48": "sp-48",
  "sp-56": "sp-56",
  "sp-64": "sp-64",
  "sp-72": "sp-72",
  "sp-80": "sp-80",
  "sp-88": "sp-88",
  "sp-96": "sp-96",
  "sp-104": "sp-104",
  "sp-112": "sp-112",
  "sp-120": "sp-120",
} as const

export type Spacings = (typeof Spacings)[keyof typeof Spacings]

/**
 * Alias for `Spacings` type — kept for internal and backward-compat use.
 * Prefer `Spacings` in public-facing code.
 */
export type SpacingSize = Spacings

/** Public props the adapter can pass into core. */
export type SpacingOptions = {
  /**
   * Token size for the spacing.
   * Prefer `Spacings.sp24` for type-safe dot access.
   *
   * ```ts
   * import { Spacings } from "@marwes-ui/react"
   * <Spacing size={Spacings.sp24} />
   * ```
   * @default "sp-24" (24px)
   */
  size?: Spacings

  /**
   * Multiplies the token value. `scale={2}` doubles any size.
   * Computed as `calc(var(--mw-spacing-{size}) * scale)`.
   * @default 1
   */
  scale?: number
}

/** A11y output — spacing is decorative, hidden from assistive tech. */
export type SpacingA11y = {
  "aria-hidden": "true"
}

/** Data attributes for styling hooks. */
export type SpacingDataAttributes = {
  "data-component": "spacing"
  "data-size": Spacings
}

/** Render kit output. */
export type SpacingRenderKit = {
  /** Always a <div> — spacing is decorative, not semantic. */
  tag: "div"

  /** CSS class names. */
  className: string

  /** CSS variables for theming. */
  vars: CssVars

  /** Accessibility props. */
  a11y: SpacingA11y

  /** Data attributes for styling hooks. */
  dataAttributes: SpacingDataAttributes
}
