import type { StackItemOptions, StackOptions } from "@marwes-ui/core"
import type { Snippet } from "svelte"
import type { HTMLAttributes } from "svelte/elements"

export interface StackProps
  extends StackOptions,
    Omit<HTMLAttributes<HTMLElement>, "class" | "style" | "children"> {
  /** Stack content, ideally StackItem or nested Stack children. */
  children?: Snippet
  class?: string
  style?: string | undefined
}

export interface StackItemProps
  extends StackItemOptions,
    Omit<HTMLAttributes<HTMLElement>, "class" | "style" | "children"> {
  children?: Snippet
  class?: string
  style?: string | undefined
}
