/**
 * Core types for Spacing component.
 * - Pure layout primitive that inserts vertical space between elements.
 * - 17 sizes mapped to the --mw-spacing-* token scale.
 * - Renders as an aria-hidden div.
 */

import type { CssVars } from "../../../shared/css-vars"

/**
 * Spacing size accessor and type — same import, two uses.
 *
 * Value access (dot notation for word sizes, bracket for numeric):
 * ```ts
 * Spacings.md          // "md"
 * Spacings["4xl"]      // "4xl"
 * ```
 *
 * Type use:
 * ```ts
 * size?: Spacings
 * ```
 *
 * Pixel scale:
 * xxxs→2 | xxs→4 | xs→8 | sm→16 | md→24 | lg→32 | xl→40 | xxl→48 | xxxl→56
 * 4xl→64  | 5xl→72  | 6xl→80  | 7xl→88  | 8xl→96  | 9xl→104 | 10xl→112 | 11xl→120
 */
export const Spacings = {
  xxxs: "xxxs",
  xxs: "xxs",
  xs: "xs",
  sm: "sm",
  md: "md",
  lg: "lg",
  xl: "xl",
  xxl: "xxl",
  xxxl: "xxxl",
  "4xl": "4xl",
  "5xl": "5xl",
  "6xl": "6xl",
  "7xl": "7xl",
  "8xl": "8xl",
  "9xl": "9xl",
  "10xl": "10xl",
  "11xl": "11xl",
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
   * Size variant for the spacing.
   * Use `Spacings.md` (or any key) for type-safe access.
   *
   * ```ts
   * import { Spacings } from "@marwes-ui/react"
   * <Spacing size={Spacings.md} />
   * ```
   * @default "md" (24px)
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
