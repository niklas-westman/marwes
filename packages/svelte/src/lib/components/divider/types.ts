import type { DividerOptions } from "@marwes-ui/core"
import type { HTMLAttributes } from "svelte/elements"

export interface DividerProps
  extends DividerOptions,
    Omit<HTMLAttributes<HTMLHRElement>, "class" | "style" | "children" | "id"> {
  class?: string
  style?: string | undefined
}
