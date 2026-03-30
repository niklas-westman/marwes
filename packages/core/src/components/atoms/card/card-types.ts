/**
 * Core types for Card.
 * - Core never renders; it returns a render kit consumed by adapters (React/Vue).
 * - Card is a single-style container — no variants.
 */

export type CardDataAttributes = Record<string, string>

export type CardOptions = {
  dataAttributes?: CardDataAttributes
}

export interface CardRenderKit {
  tag: "div"
  className: string
  vars: Record<string, string>
  dataAttributes?: CardDataAttributes
}
