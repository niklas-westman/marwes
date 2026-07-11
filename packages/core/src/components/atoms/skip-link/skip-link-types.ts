/**
 * Core types for SkipLink.
 * - Visually hidden anchor that becomes visible on focus.
 * - Pairs with a target element (typically <main>) via an href fragment.
 */

export interface SkipLinkOptions {
  /** Anchor href, typically a fragment like "#main". */
  href: string
  /** Optional class name to merge with the recipe class. */
  className?: string | undefined
}

export interface SkipLinkRenderKit {
  tag: "a"
  className: string
}
