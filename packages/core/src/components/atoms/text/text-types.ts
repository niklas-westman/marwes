/**
 * Core types for non-heading text typography.
 * - Use Text for display/label/caption/overline/micro styles that should not create heading hierarchy.
 */

import type { CssVars } from "../../../shared/css-vars"
import type { TextVariant } from "../../../theme/text-variant"
import type { SemanticHeadingLevel } from "../heading/heading-types"

export type TextAs = "span" | "p" | "div" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6"

export interface TextOptions {
  /**
   * Visual typography variant.
   * @default "caption"
   */
  variant?: TextVariant

  /**
   * Rendered HTML element.
   * @default "span"
   */
  as?: TextAs

  /**
   * Render as a heading element (h1–h6) while keeping the visual variant.
   * Wins over `as` when both are set. Use this to give the page outline
   * a semantic level without coupling it to the visual size. The dedicated
   * `Heading` component is preferred when the visual size IS a heading size;
   * use `headingLevel` on `Text` when the visual variant is display/overline/etc.
   */
  headingLevel?: SemanticHeadingLevel

  /**
   * Optional ID.
   */
  id?: string
}

export interface TextA11y {
  id?: string
}

export interface TextRenderKit {
  tag: TextAs
  className: string
  vars: CssVars
  a11y: TextA11y
}
