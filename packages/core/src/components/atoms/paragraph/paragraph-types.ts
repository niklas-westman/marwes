/**
 * Core types for Paragraph component.
 * - Core returns a render kit consumed by adapters (React/Vue).
 * - Supports size variants: sm/md/lg.
 */

import type { CssVars } from "../../../shared/css-vars";
import type { ParagraphSize } from "../../../theme/theme-types";

/** Public props the adapter can pass into core. */
export type ParagraphOptions = {
  /**
   * Visual size variant.
   * Default: "md"
   */
  size?: ParagraphSize;

  /**
   * Optional ID.
   */
  id?: string;
};

/** Strict a11y output (minimal for paragraphs). */
export type ParagraphA11y = {
  id?: string;
};

/** Render kit output. */
export type ParagraphRenderKit = {
  /** Always <p> tag. */
  tag: "p";

  /** CSS class names. */
  className: string;

  /** CSS variables for theming. */
  vars: CssVars;

  /** Accessibility props. */
  a11y: ParagraphA11y;
};
