import type { ParagraphSize } from "@marwes-ui/core"
import type { Snippet } from "svelte"

export interface ParagraphProps {
  size?: ParagraphSize
  id?: string
  children?: Snippet
  class?: string
  style?: string | undefined
}
