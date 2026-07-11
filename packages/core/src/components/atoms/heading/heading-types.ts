/**
 * Core types for Heading components (H1, H2, H3).
 * - Core returns a render kit consumed by adapters (React/Vue).
 * - Supports semantic level (h1/h2/h3) and visual size override.
 */

import type { CssVars } from "../../../shared/css-vars"
import type { HeadingSize } from "../../../theme/theme-types"

/**
 * Heading levels styled by the design system.
 *
 * Marwes officially ships visual styling for H1-H3 only. The `Heading`
 * recipe and the `H1`/`H2`/`H3` adapters are scoped to this ladder.
 *
 * For semantic-only H4-H6 (deep section nesting, accessibility outlines),
 * see {@link SemanticHeadingLevel} and the `Text` component's `headingLevel`
 * prop — `<Text headingLevel={4} variant="..." />` renders an `<h4>` while
 * letting the consumer pick the visual variant.
 */
export type HeadingLevel = 1 | 2 | 3

/**
 * Every HTML heading level the design system acknowledges semantically.
 *
 * Wider than {@link HeadingLevel} (which is the styled subset). Use this
 * when typing a consumer-side wrapper that needs to accept all six rungs
 * of the HTML heading ladder — e.g. a `MyH4` wrapper built around
 * `<Text headingLevel={4} />`.
 */
export type SemanticHeadingLevel = 1 | 2 | 3 | 4 | 5 | 6

/** Public props the adapter can pass into core. */
export type HeadingOptions = {
  /**
   * Semantic level (determines HTML tag).
   * Required - adapters (H1/H2/H3) will hardcode this.
   */
  level: HeadingLevel

  /**
   * Visual size override.
   * If omitted, defaults to match the level (h1 → "h1", h2 → "h2", etc.).
   * Allows semantic/visual mismatch: <h1 size="h3"> for SEO.
   */
  size?: HeadingSize

  /**
   * Optional ID for anchor linking.
   */
  id?: string

  /**
   * Accessibility label (rare for headings).
   */
  ariaLabel?: string
}

/** Strict a11y output. */
export type HeadingA11y = {
  id?: string
  ariaLabel?: string
}

/** Render kit output. */
export type HeadingRenderKit = {
  /** Semantic HTML tag based on level. */
  tag: "h1" | "h2" | "h3"

  /** CSS class names. */
  className: string

  /** CSS variables for theming. */
  vars: CssVars

  /** Accessibility props. */
  a11y: HeadingA11y
}
