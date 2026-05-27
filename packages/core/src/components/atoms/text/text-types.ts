/**
 * Core types for non-heading text typography.
 * - Use Text for display/label/caption/overline/micro styles that should not create document outline.
 */

import type { CssVars } from "../../../shared/css-vars"
import type { TextVariant } from "../../../theme/text-variant"

export type TextAs = "span" | "p" | "div"

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
