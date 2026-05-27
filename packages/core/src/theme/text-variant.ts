/**
 * Non-heading text typography variants.
 * Use `TextVariant.display` for type-safe runtime access.
 */
export const TextVariant = {
  display: "display",
  label: "label",
  labelSmall: "label-small",
  caption: "caption",
  overline: "overline",
  micro: "micro",
} as const

export type TextVariant = (typeof TextVariant)[keyof typeof TextVariant]
