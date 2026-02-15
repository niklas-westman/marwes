/**
 * Builds strict a11y output for Heading.
 * - Headings are semantic by default, minimal a11y needed.
 */

import type { HeadingA11y, HeadingOptions } from "./heading-types"

export function buildHeadingA11y(opts: HeadingOptions): HeadingA11y {
  const a11y: HeadingA11y = {}

  if (opts.id) a11y.id = opts.id
  if (opts.ariaLabel) a11y.ariaLabel = opts.ariaLabel

  return a11y
}
