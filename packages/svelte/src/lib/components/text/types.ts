import type { TextAs, TextVariant } from "@marwes-ui/core"
import type { Snippet } from "svelte"

export interface TextProps {
  variant?: TextVariant
  as?: TextAs
  id?: string
  children?: Snippet
  class?: string
  style?: string | undefined
}
