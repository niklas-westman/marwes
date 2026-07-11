import type { TextAs, TextVariant } from "@marwes-ui/core"
import type { Snippet } from "svelte"

export interface TextProps {
  variant?: TextVariant
  as?: TextAs
  /**
   * Render as a heading element (h1–h6) while keeping the visual variant.
   * Wins over `as` when both are set.
   */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6
  id?: string
  children?: Snippet
  class?: string
  style?: string | undefined
}
